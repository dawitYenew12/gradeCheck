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
    logger.info(JSON.stringify(grades))
    
    if (totalGrades === 0) {
      logger.info('No grades to process');
      await job.updateProgress(100); // Mark as complete if there are no grades
      return;
    }
    
    for (let i = 0; i < totalGrades; i += config.batchSize) {
      const batch = grades.slice(i, i + config.batchSize);
      logger.info("batch: ")
      logger.info(JSON.stringify(batch))
      await adminService.saveStudentGrades(batch, hashedGrade);
      
      // Calculate progress based on processed records, ensuring it doesn't exceed 100%
      const processedCount = Math.min(i + batch.length, totalGrades);
      const progress = Math.floor((processedCount / totalGrades) * 100);
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
