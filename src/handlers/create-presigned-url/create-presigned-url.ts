import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { apiLambdaWrapper, apiResponse } from '../../helpers';
import { CreatePresignedUrlEventBody } from '../../interfaces';

const createPresignedUrl = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const { key, fileSize } =
    (event.body && (JSON.parse(event.body) as CreatePresignedUrlEventBody)) ||
    {};

  return apiResponse(200, {
    message: 'Hello world',
    input: {
      key,
      fileSize
    }
  });
};

export const handler = apiLambdaWrapper(createPresignedUrl);
