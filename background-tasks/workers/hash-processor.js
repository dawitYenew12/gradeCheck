const adminService = require('../../services/admin.service');
const logger = require('../../utils/logger');
const checkMongooseConnection = require('../../utils/checkMongoose');

module.exports = async (job) => {
  logger.info('Processing hash job');
  const grades = job.data;
  const gradeHash = await adminService.calculateHash(grades);
  await adminService.saveStudentGrades(gradeHash, grades);
};
