import winston from 'winston';

import { stackEnvVariables } from './stack-env-variables';

export const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      silent: !stackEnvVariables.LOG_ENABLED
    })
  ]
});
