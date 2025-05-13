const { Worker } = require('bullmq');
const path = require('path');
const config = require('../../config/config');
const logger = require('../../utils/logger');
const { pathToFileURL } = require('url');

const createWorker = async (workerName, workerFileName, ioServer) => {
  const filePath = path.join(__dirname, workerFileName);
  const processorPath = pathToFileURL(filePath);

  const worker = new Worker(workerName, processorPath, {
    connection: {
      host: config.redis.host,
      port: config.redis.port,
    },
    autorun: true,
  });

  if (workerName === 'ExcelProcessor') {
    worker.on('progress', (job, progress) => {
      ioServer.emit('progress', { jobId: job.id, progress });
      logger.info(`Job ${job.id} progress: ${progress}%`);
    });
    worker.on('completed', (job) => {
      ioServer.emit('completed', { jobId: job.id });
      logger.info(`Job ${job.id} completed`);
    });
    worker.on('failed', async (job, err) => {
      ioServer.emit('failed', { jobId: job.id, error: err.message });
      logger.error(`Job ${job.id} failed with error: ${err.message}`);
      await saveJobError(job.id, err.message);
    });
  }
};

module.exports = createWorker;
