const mongoose = require('mongoose');
const config = require('../config/config');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

module.exports = async () => {
  try {
    const connection = await mongoose.connect(config.dbUri);
    return connection;
  } catch (error) {
    console.error('Connection error details:', error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Error while connecting to the database',
    );
  }
};
