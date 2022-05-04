import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context
} from 'aws-lambda';
import Joi from 'joi';

import { apiResponse } from './api-response';
import { logger } from './logger';
import { schemaValidator } from './schema-validator';

export interface LambdaWrapperOptions {
  validationSchema?: Joi.Schema;
  handlerName: string;
}

export const apiLambdaWrapper =
  (
    handler: (
      event: APIGatewayProxyEvent,
      context?: Context
    ) => Promise<APIGatewayProxyResult>,
    options: LambdaWrapperOptions
  ) =>
  async (
    event: APIGatewayProxyEvent,
    context: Context
  ): Promise<APIGatewayProxyResult> => {
    const body = event.body ? JSON.parse(event.body) : {};
    logger.info({
      message: 'Request received',
      handler: options.handlerName
    });

    // Add auth at some point?

    if (options.validationSchema) {
      logger.info({
        message: 'Validating scheme',
        handler: options.handlerName
      });

      try {
        const errors = await schemaValidator(options.validationSchema, body);

        if (errors) {
          return apiResponse(400, {
            errors
          });
        }
      } catch (error) {
        return apiResponse(500, {
          message: 'Internal server error.'
        });
      }
    }

    try {
      logger.info({ message: 'Calling handler' });
      return await handler(event, context);
    } catch (error) {
      return apiResponse(500, {
        error: 'Internal server error.'
      });
    }
  };
