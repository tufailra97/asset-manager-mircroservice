import winston from 'winston';

import { stackEnvVariables } from './stack-env-variables';

export const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: stackEnvVariables.LOG_ENABLED ? 'debug' : 'info',
      silent: !stackEnvVariables.LOG_ENABLED,
      format: winston.format.combine(
        winston.format.printf((info) => {
          const { level, ...rest } = info;
          return `[${level.toUpperCase()}] - ${JSON.stringify(rest)}`;
        })
      )
    })
  ]
});
