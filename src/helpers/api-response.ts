import { APIGatewayProxyResult } from 'aws-lambda';

export const apiResponse = (
  statusCode: number,
  body: unknown
): APIGatewayProxyResult => {
  return {
    statusCode,
    body: JSON.stringify(body)
  };
};
