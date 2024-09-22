const ApiError = require('../utils/ApiError.js');
const joi = require('joi');
const logger = require('../utils/logger');

const validate = (schema) => (req, res, next) => {
  const keys = Object.keys(schema);
  const reducedObject = keys.reduce((obj, key) => {
    if (Object.prototype.hasOwnProperty.call(req, key)) {
      obj[key] = req[key];
    }
    return obj;
  }, {});
  const { value, error } = joi.compile(schema).validate(reducedObject);
  if (error) {
    logger.error(error);
    const errors = error.details.map((detail) => detail.message).join(',');
    next(new ApiError(400, errors));
  }

  next();
};

module.exports = validate;
