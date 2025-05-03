const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const logger = require('../utils/logger');
const excelProcessorQueue = require('../background-tasks/queues/excel-processor');

const uploadGrades = catchAsync(async (req, res) => {
  const fileBuffer = req.file.buffer;
  const base64File = fileBuffer.toString('base64');
  const job = await excelProcessorQueue.add('ExcelProcessorJob', base64File);
  res.status(httpStatus.CREATED).json({
    success: true,
    message: 'Uploading and processing a file...',
    jobId: job.id,
  });
});

module.exports = { uploadGrades };
