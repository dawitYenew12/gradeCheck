const logger = require('../utils/logger');
const expressLoader = require('./express');
const mongooseLoader = require('./mongoose');
const redisClient = require('../config/redis');
const createWorker = require('../background-tasks/workers');

module.exports = async (app) => {
  await mongooseLoader();
  logger.info('Mongoose fully connected!');

  await expressLoader(app);
  logger.info('Express initiated!');

  await redisClient.connect();
  logger.info('Redis initiated!');

  const workers = [
    { name: 'ExcelProcessor', fileName: 'excel-processor.js' },
    { name: 'HashProcessor', fileName: 'hash-processor.js' },
  ];

  for (const worker of workers) {
    await createWorker(worker.name, worker.fileName);
  }
};
