const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const mongoose = require('mongoose');
const logger = require('../utils/logger');
const config = require('../config/config');

const errorConverter = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || error instanceof mongoose.Error
        ? httpStatus.BAD_REQUEST
        : httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, false, error.stack);
  }
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;
  if (config.env === 'production' && !err.isOperational) {
    (statusCode = httpStatus.INTERNAL_SERVER_ERROR),
      (message = httpStatus[statusCode]);
  }
  const response = {
    error: true,
    code: statusCode,
    message: message,
    ...(config.env === 'production' && { stack: err.stack }),
  };

  res.locals.errorMessage = message;
  if (config.env === 'development') {
    logger.error(err);
  }
  res.status(statusCode).json(response);
};

module.exports = { errorConverter, errorHandler };
