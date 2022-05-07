import Joi from 'joi';

export const getAssetBodySchema = Joi.object({
  key: Joi.string().required()
});
