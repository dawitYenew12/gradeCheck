const redis = require('redis');
const logger = require('../utils/logger');

const client = redis.createClient();

client.on('error', (error) => {
  logger.error(error);
});

module.exports = client;
