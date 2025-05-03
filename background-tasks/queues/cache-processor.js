const { Queue } = require('bullmq');
const config = require('../../config/config');

const cacheProcessorQueue = new Queue('CacheProcessor', {
  connection: {
    host: config.redis.host,
    port: config.redis.port,
  },
});

module.exports = cacheProcessorQueue;
