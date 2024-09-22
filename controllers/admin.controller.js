const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const logger = require('../utils/logger');
const adminService = require('../services/admin.service');
const excelProcessorQueue = require('../background-tasks/queues/excel-processor');

const uploadGrades = catchAsync(async (req, res) => {
  const fileBuffer = req.file.buffer;
  const base64File = fileBuffer.toString('base64');
  excelProcessorQueue.add('ExcelProcessorJob', base64File);
  res.status(httpStatus.CREATED).json({
    success: true,
    message:
      'Data successfully uploaded and will be processed in the background.',
  });
});

module.exports = { uploadGrades };
