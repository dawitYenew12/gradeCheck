const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const schoolInfoSchema = new Schema({
  zone: {
    type: String,
    required: true,
  },
  woreda: {
    type: String,
    required: true,
  },
  schoolName: {
    type: String,
    required: true,
  },
  numOfExamTakers: {
    type: Number,
    required: true,
  },
});

const SchoolInfo = model('SchoolInfo', schoolInfoSchema);
module.exports = { SchoolInfo };
