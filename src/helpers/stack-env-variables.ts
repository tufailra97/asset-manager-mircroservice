import { config } from 'dotenv';

import { StackEnvVariables } from '../interfaces';
import { Environments } from '../types';

config();

export const stackEnvVariables: StackEnvVariables = {
  LOG_ENABLED: Boolean(process.env.LOG_ENABLED),
  PRESIGNED_URL_LIFETIME: Number(process.env.PRESIGNED_URL_LIFETIME),
  ENVIRONMENT:
    (process.env.ENVIRONMENT as Environments) || Environments.DEVELOPMENT,
  FILE_MAX_SIZE: Number(process.env.FILE_MAX_SIZE),
  BUCKET_NAME: process.env.BUCKET_NAME || ''
};
