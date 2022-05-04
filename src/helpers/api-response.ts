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
    body: JSON.stringify(body),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Headers':
        'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT, DELETE'
    }
  };
};
