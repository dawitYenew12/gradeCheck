const mongoose = require('mongoose');
const logger = require('./logger');

module.exports = checkMongooseConnection = async () => {
  if (mongoose.connection.readyState !== 1) {
    logger.info('Mongoose is not connected. Waiting for connection...');
    mongoose.connection.once('connected', () => {
      logger.info('Mongoose connected!');
    });
  } else {
    logger.info('Mongoose already connected.');
  }
};
