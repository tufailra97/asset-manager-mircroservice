import { Environments } from '../types';

export interface StackEnvVariables {
  LOG_ENABLED: boolean;
  PRESIGNED_URL_LIFETIME: number;
  ENVIRONMENT: Environments;
  FILE_MAX_SIZE: number;
  BUCKET_NAME: string;
}
