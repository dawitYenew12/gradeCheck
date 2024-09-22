const mongoose = require('mongoose');
const xlsx = require('xlsx');
const StudentInfo = require('../models/grade.model');
const logger = require('../utils/logger');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const crypto = require('crypto');
const hashProcessorQueue = require('../background-tasks/queues/hash-processor');
const config = require('../config/config');

const processExcelFile = async (fileBuffer) => {
  try {
    const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const workSheet = workbook.Sheets[sheetName];
    const grades = xlsx.utils.sheet_to_json(workSheet);
    logger.info(typeof grades);
    await hashProcessorQueue.add('HashProcessorJob', grades);
  } catch (error) {
    logger.error(error);
  }
};

const reconnectWithDelay = async (delay) => {
  logger.info(`Attempting to reconnect in ${delay / 1000} seconds...`);
  await new Promise((resolve) => setTimeout(resolve, delay));
  await mongoose.connect(config.dbUri);
};

const ensureMongooseConnected = async () => {
  if (mongoose.connection.readyState !== 1) {
    logger.error('Mongoose is not connected. Waiting for connection...');
    await reconnectWithDelay(5000);
  }
};

const saveStudentGrades = async (hashedGrade, studGrades) => {
  try {
    const grades = studGrades.map((studGrade) => {
      const admissionNumber = studGrade['Admission Number'];
      const studName = studGrade['Name'];

      if (!admissionNumber || !studName) {
        logger.error('Missing admissionNumber or studName', {
          admissionNumber,
          studName,
        });
        throw new Error('Missing required fields');
      }

      return {
        admissionNumber,
        studName,
        grades: [
          { subject: 'Math', grade: studGrade['Math'] },
          { subject: 'Science', grade: studGrade['Science'] },
          { subject: 'English', grade: studGrade['English'] },
          { subject: 'History', grade: studGrade['History'] },
        ],
        datasetHash: hashedGrade,
      };
    });

    await ensureMongooseConnected();
    if (StudentInfo.findOne({ datasetHash: hashedGrade })) {
      logger.info('Dataset already exists in the database');
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Dataset already exists in the database',
      );
    }

    const savedStudents = await StudentInfo.insertMany(grades, {
      ordered: false,
    });
    logger.info('All student grades saved successfully');
    return savedStudents;
  } catch (error) {
    logger.error(error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Error while saving student grades',
    );
  }
};

const calculateHash = async (data) => {
  const grades = JSON.stringify(data);
  const hash = crypto.createHash('sha256');
  hash.update(grades);
  return hash.digest('hex');
};

module.exports = { processExcelFile, saveStudentGrades, calculateHash };
