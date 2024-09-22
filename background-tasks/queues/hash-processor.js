const { Queue } = require('bullmq');
const config = require('../../config/config');

const hashProcessorQueue = new Queue('HashProcessor', {
  connection: {
    host: config.redis.host,
    port: config.redis.port,
  },
});

module.exports = hashProcessorQueue;
