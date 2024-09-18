const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const studentInfoSchema = new Schema({
  admissionNumber: {
    type: String,
    required: true,
    match: /^[a-zA-Z0-9]{6}$/,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    maxlength: 50,
  },
  grades: [
    {
      subject: { type: String, required: true },
      grade: { type: Number, required: true },
    },
  ],
});

const StudentInfo = model('StudentInfo', studentInfoSchema);
module.exports = { StudentInfo };
