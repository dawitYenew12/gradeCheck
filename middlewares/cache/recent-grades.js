const redisClient = require('../../config/redis');
const logger = require('../../utils/logger');

module.exports = async (req, res, next) => {
  try {
    const key = 'recent-grades';
    const cachedGrades = await redisClient.get(key);
    if (cachedGrades) {
      logger.info('serving from cache');
      return res.json({ data: JSON.parse(cachedGrades) });
    } else {
      next();
    }
  } catch (error) {
    logger.error(error);
    next();
  }
};
