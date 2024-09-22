const logger = require('../../utils/logger');
const adminService = require('../../services/admin.service');

module.exports = async (job) => {
  try {
    const base64File = job.data;
    const fileBuffer = Buffer.from(base64File, 'base64');
    await adminService.processExcelFile(fileBuffer);
  } catch (error) {
    logger.info('Error processing excel file');
    logger.error(error);
  }
};
