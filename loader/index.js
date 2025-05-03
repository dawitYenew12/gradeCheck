const logger = require('../utils/logger');
const expressLoader = require('./express');
const mongooseLoader = require('./mongoose');
const redisClient = require('../config/redis');
const createWorker = require('../background-tasks/workers');

module.exports = async (app, ioServer) => {
  await mongooseLoader();
  logger.info('Mongoose fully connected!');

  await expressLoader(app);
  logger.info('Express initiated!');

  await redisClient.connect();
  logger.info('Redis initiated!');

  const workers = [
    { name: 'ExcelProcessor', fileName: 'excel-processor.js' },
    { name: 'CacheProcessor', fileName: 'cache-processor.js' },
  ];
  for (const worker of workers) {
    if (worker.name === 'ExcelProcessor') {
      await createWorker(worker.name, worker.fileName, ioServer);
    } else {
      await createWorker(worker.name, worker.fileName);
    }
  }
};
