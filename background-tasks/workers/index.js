const { Worker } = require('bullmq');
const path = require('path');
const config = require('../../config/config');
const logger = require('../../utils/logger');
const { pathToFileURL } = require('url');

const createWorker = async (workerName, workerFileName) => {
  const filePath = path.join(__dirname, workerFileName);
  const processorPath = pathToFileURL(filePath);
  const worker = new Worker(workerName, processorPath, {
    connection: {
      host: config.redis.host,
      port: config.redis.port,
    },
    autorun: true,
  });

  worker.on('completed', (job) => {
    logger.info(`completed job: ${job.name} Id: ${job.id}`);
  });
};

module.exports = createWorker;
