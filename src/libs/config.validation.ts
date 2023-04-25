import * as joi from 'joi';

export const configValidationSchema = joi.object({
  NODE_ENV: joi.string(),
  POSTGRES_HOST: joi.string(),
  POSTGRES_PORT: joi.number(),
  POSTGRES_USER: joi.string(),
  POSTGRES_PASSWORD: joi.string(),
  POSTGRES_DB: joi.string(),
  PORT: joi.number().default(3001),
});
