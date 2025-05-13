const httpStatus = require('http-status');
const redisClient = require('../../config/redis');
const ApiError = require('../../utils/ApiError');
const logger = require('../../utils/logger');

module.exports = async (job) => {
  try {
    const grades = JSON.stringify(job.data.grades);
    await redisClient.connect();
    await redisClient.set(`recent-grade-${job.data.admissionNumber}`, grades);
  } catch (error) {
    throw new ApiError(httpStatus.SERVICE_UNAVAILABLE, 'Service unavailable');
  }
};
