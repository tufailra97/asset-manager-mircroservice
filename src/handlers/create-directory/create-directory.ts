import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import {
  apiLambdaWrapper,
  apiResponse,
  logger,
  stackEnvVariables
} from '../../helpers';
import { GetAssetsEventBody } from '../../interfaces';
import { s3Service } from '../../services';
import { createDirectorySchema } from './schema/event-body';

const createDirectory = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const { key = '' } =
    (event.body && (JSON.parse(event.body) as GetAssetsEventBody)) || {};

  try {
    logger.info({
      message: 'Creating directory.',
      params: { key }
    });

    const directory = await s3Service
      .upload({
        Key: key,
        Bucket: stackEnvVariables.BUCKET_NAME,
        Body: ''
      })
      .promise();

    return apiResponse(200, {
      message: 'Directory created.',
      directory: directory.Key
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logger.error({
      error: error.message
    });

    return apiResponse(500, {
      message: 'Internal server error.'
    });
  }
};

export const handler = apiLambdaWrapper(createDirectory, {
  handlerName: 'get-assets',
  validationSchema: createDirectorySchema
});
