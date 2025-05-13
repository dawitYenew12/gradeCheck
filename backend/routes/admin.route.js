const express = require('express');
const upload = require('../utils/multer');

const adminController = require('../controllers/admin.controller');

const router = express.Router();
router.post(
  '/grade/upload',
  upload.single('gradesFile'),
  adminController.uploadGrades,
);

module.exports = router;
