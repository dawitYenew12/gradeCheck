const mongoose = require('mongoose');
const xlsx = require('xlsx');
const StudentInfo = require('../models/grade.model');
const logger = require('../utils/logger');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const crypto = require('crypto');
const config = require('../config/config');

const calculateHash = async (data) => {
  const grades = JSON.stringify(data);
  const hash = crypto.createHash('sha256');
  hash.update(grades);
  return hash.digest('hex');
};

const checkDuplicateFile = async (fileBuffer) => {
  try {
    const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const workSheet = workbook.Sheets[sheetName];
    const grades = xlsx.utils.sheet_to_json(workSheet);
    const hashedGrade = await calculateHash(grades);
    
    await ensureMongooseConnected();
    const existingDataset = await StudentInfo.findOne({
      datasetHash: hashedGrade,
    });
    
    if (existingDataset) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Duplicate file exists'
      );
    }
    
    return hashedGrade;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(httpStatus.BAD_REQUEST, 'Error checking for duplicate file');
  }
};

const processExcelFile = async (fileBuffer) => {
  try {
    const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const workSheet = workbook.Sheets[sheetName];
    const grades = xlsx.utils.sheet_to_json(workSheet);
    const hashedGrade = await calculateHash(grades);
    await ensureMongooseConnected();
    const existingDataset = await StudentInfo.findOne({
      datasetHash: hashedGrade,
    });
    if (existingDataset) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Dataset already exists in the database',
      );
    }

    return { grades, hashedGrade };
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Duplicate file exists');
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
    await reconnectWithDelay(config.dbReconnectDelay);
  }
};

const saveStudentGrades = async (studGrades, hashedGrade) => {
  try {
    const grades = studGrades.map((studGrade) => {
      const admissionNumber = studGrade['admissionNumber'];
      const studName = studGrade['studName'];

      if (!admissionNumber || !studName) {
        logger.error('Missing admissionNumber or studName', {
          admissionNumber,
          studName,
        });
        throw new ApiError(httpStatus.BAD_REQUEST, 'Missing required fields');
      }

      return {
        admissionNumber,
        studName,
        grades: [
          { subject: 'English', grade: studGrade['english'] },
          { subject: 'Amharic', grade: studGrade['amharic'] },
          { subject: 'Physics', grade: studGrade['physics'] },
        ],
        datasetHash: hashedGrade,
      };
    });
    logger.info("grades: ")
    logger.info(JSON.stringify(grades))

    await ensureMongooseConnected();

    const savedStudents = await StudentInfo.insertMany(grades, {
      ordered: false,
    });
    logger.info('All student grades saved successfully');
    return savedStudents;
  } catch (error) {
    logger.error('Error saving student grades to database:', error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to save student grades to database'
    );
  }
};

module.exports = { processExcelFile, saveStudentGrades, calculateHash, checkDuplicateFile };
