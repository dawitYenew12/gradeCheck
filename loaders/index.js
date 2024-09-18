const logger = require('../utils/logger');
const expressLoader = require('./express');
const mongooseLoader = require('./mongoose');

module.exports = async (app) => {
  await expressLoader(app);
  logger.info('express initiated!');
  await mongooseLoader();
  logger.info('mongoose initiated!');
};
