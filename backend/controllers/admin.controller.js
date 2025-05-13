const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const logger = require('../utils/logger');
const excelProcessorQueue = require('../background-tasks/queues/excel-processor');
const adminService = require('../services/admin.service');
const ApiError = require('../utils/ApiError');

const uploadGrades = catchAsync(async (req, res) => {
  try {
    const fileBuffer = req.file.buffer;
    
    // Check for duplicate file before adding to queue
    try {
      // Verify if this is a duplicate file
      const base64File = fileBuffer.toString('base64');
      await adminService.checkDuplicateFile(fileBuffer);
      
      // If no error was thrown, proceed with adding to queue
      const job = await excelProcessorQueue.add('ExcelProcessorJob', base64File);
      
      return res.status(httpStatus.CREATED).json({
        success: true,
        message: 'Uploading and processing a file...',
        jobId: job.id,
      });
    } catch (error) {
      // If it's a duplicate file error, return appropriate response
      if (error.message === 'Duplicate file exists' || 
          error.message === 'Dataset already exists in the database') {
        logger.error('Duplicate file detected');
        return res.status(httpStatus.BAD_REQUEST).json({
          success: false,
          message: 'This file has already been uploaded. Duplicate files are not allowed.',
        });
      }
      // For other errors, re-throw
      throw error;
    }
  } catch (error) {
    logger.error(`Error uploading file: ${error.message}`);
    throw new ApiError(
      error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
      error.message || 'An error occurred while uploading the file'
    );
  }
});

module.exports = { uploadGrades };
