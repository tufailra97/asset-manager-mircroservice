import Joi from 'joi';

interface ShemaValidatorResult {
  message: string;
  path: string;
}

export const schemaValidator = async (
  schema: Joi.Schema,
  object: object,
  options?: Joi.ValidationOptions
): Promise<ShemaValidatorResult[] | null> => {
  try {
    await schema.validateAsync(object, options);
    return null;
  } catch (err) {
    const error = err as Joi.ValidationError;

    const errors = error?.details
      ? error?.details.map((detail) => ({
          message: detail.message,
          path: detail.path.join(' > ')
        }))
      : [];

    return errors;
  }
};
