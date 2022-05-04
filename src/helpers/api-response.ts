import { APIGatewayProxyResult } from 'aws-lambda';

export const apiResponse = (
  statusCode: number,
  body: object,
  internalDetails?: object
): APIGatewayProxyResult => {
  if (internalDetails) {
    // log internal details
  }

  return {
    statusCode,
    body: JSON.stringify(body)
  };
};
