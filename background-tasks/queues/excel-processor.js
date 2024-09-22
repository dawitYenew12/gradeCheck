const { Queue } = require('bullmq');
const config = require('../../config/config');

const excelProcessorQueue = new Queue('ExcelProcessor', {
  connection: {
    host: config.redis.host,
    port: config.redis.port,
  },
});

module.exports = excelProcessorQueue;
