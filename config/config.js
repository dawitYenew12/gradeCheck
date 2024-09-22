const dotenv = require('dotenv');
const envVarsSchema = require('../validation/env.validation');
dotenv.config();

const { error, value: envVars } = envVarsSchema.validate(process.env);

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  dbUri: envVars.DB_URI,
  redis: {
    host: envVars.REDIS_HOST,
    port: envVars.REDIS_PORT,
  },
};
