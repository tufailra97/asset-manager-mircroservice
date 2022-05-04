import * as Joi from 'joi';

import { schemaValidator } from '../schema-validator';

describe('schemaValidator', () => {
  it('should return null if the object is valid', async () => {
    const schema = Joi.object().keys({
      name: Joi.string().required(),
      age: Joi.number().required()
    });

    const result = await schemaValidator(schema, {
      name: 'John',
      age: 20
    });

    expect(result).toBeNull();
  });

  it('should return the errors if the validation fails', async () => {
    const schema = Joi.object().keys({
      name: Joi.string().required(),
      age: Joi.number().required(),
      address: Joi.string().required()
    });

    const result = await schemaValidator(
      schema,
      {
        age: '20'
      },
      {
        abortEarly: false
      }
    );

    console.log('result', result);

    expect(result).toStrictEqual([
      { message: '"name" is required', path: 'name' },
      { message: '"address" is required', path: 'address' }
    ]);
  });
});
