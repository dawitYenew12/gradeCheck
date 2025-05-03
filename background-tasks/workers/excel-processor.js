 
const logger = require('../../utils/logger');
const adminService = require('../../services/admin.service');
const ApiError = require('../../utils/ApiError');
const httpStatus = require('http-status');
const config = require('../../config/config');

module.exports = async (job) => {
  try {
    const base64File = job.data;
    logger.info('Processing excel file...');
    const fileBuffer = Buffer.from(base64File, 'base64');
    const { grades, hashedGrade } =
      await adminService.processExcelFile(fileBuffer);
    const totalGrades = grades.length;

    for (let i = 0; i < totalGrades; i += config.batchSize) {
      const batch = grades.slice(i, i + config.batchSize);
      await adminService.saveStudentGrades(batch, hashedGrade);
      const progress = Math.floor(((i + batch.length) / totalGrades) * 100);
      await job.updateProgress(progress);

      logger.info(`Progress: ${progress}%`);
    }
    logger.info('Excel file processed successfully');
  } catch (error) {
    logger.error('Duplicate file exists');
    if (!(error instanceof ApiError)) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'An error occurred while processing the Excel file',
      );
    }
    throw error;
  }
};
