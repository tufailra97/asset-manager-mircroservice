import Joi from 'joi';

import { stackEnvVariables } from '../../../helpers/stack-env-variables';

export const eventBodySchema = Joi.object({
  fileSize: Joi.number()
    .integer()
    .min(1)
    .max(stackEnvVariables.FILE_MAX_SIZE)
    .required(),
  fileName: Joi.string().max(50).min(2).required(),
  directory: Joi.string().min(1).max(50).default('/')
});
