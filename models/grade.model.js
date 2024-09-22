const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const studentInfoSchema = new Schema({
  admissionNumber: {
    type: String,
    match: /^[a-zA-Z0-9]{6}$/,
    unique: true,
  },
  studName: {
    type: String,
    maxlength: 50,
  },
  grades: [
    {
      subject: { type: String, required: true },
      grade: { type: Number, required: true },
    },
  ],
  datasetHash: {
    type: String,
    required: true,
  },
});

const StudentInfo = model('StudentInfo', studentInfoSchema);
module.exports = StudentInfo;
