import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import {
  apiLambdaWrapper,
  apiResponse,
  logger,
  stackEnvVariables
} from '../../helpers';
import { CreatePresignedUrlEventBody } from '../../interfaces';
import { s3Service } from '../../services';
import { createPreSignedUrl } from './schemas/create-presigned-url-body';

const createPresignedUrl = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const { key, fileSize } =
    (event.body && (JSON.parse(event.body) as CreatePresignedUrlEventBody)) ||
    {};

  try {
    logger.info({
      message: 'Creating presigned url',
      params: { key, fileSize }
    });

    const data = s3Service.createPresignedPost({
      Bucket: stackEnvVariables.BUCKET_NAME,
      Expires: stackEnvVariables.PRESIGNED_URL_LIFETIME,
      Conditions: [
        ['content-length-range', 1, stackEnvVariables.FILE_MAX_SIZE]
      ],
      Fields: {
        key
      }
    });

    return apiResponse(200, {
      message: 'Presigned url created.',
      data
    });
  } catch (error) {
    logger.error({
      message: 'Error creating presigned url.',
      error
    });
    return apiResponse(500, {
      message: 'Internal server error.'
    });
  }
};

export const handler = apiLambdaWrapper(createPresignedUrl, {
  handlerName: 'create-presigned-url',
  validationSchema: createPreSignedUrl
});
