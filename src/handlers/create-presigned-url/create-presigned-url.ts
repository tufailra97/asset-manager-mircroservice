import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { apiLambdaWrapper, apiResponse, logger } from '../../helpers';
import { CreatePresignedUrlEventBody } from '../../interfaces';
import { eventBodySchema } from './schemas/event-body';

const createPresignedUrl = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const { key, fileSize } =
    (event.body && (JSON.parse(event.body) as CreatePresignedUrlEventBody)) ||
    {};

  logger.info('key', key);

  return apiResponse(200, {
    message: 'Hello world',
    input: {
      key,
      fileSize
    }
  });
};

export const handler = apiLambdaWrapper(createPresignedUrl, {
  handlerName: 'create-presigned-url',
  validationSchema: eventBodySchema
});
