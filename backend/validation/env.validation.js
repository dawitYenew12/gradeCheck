const joi = require('joi');

const envVarSchema = joi
  .object({
    DB_URI: joi.string().required(),
    PORT: joi.number().positive().required(),
  })
  .unknown();

module.exports = envVarSchema;
