import Joi from 'joi';

export const createDirectorySchema = Joi.object({
  key: Joi.string().required()
});
