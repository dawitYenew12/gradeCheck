const multer = require('multer');
const httpStatus = require('http-status');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
  ];
  const maxFileSize = 100 * 1024 * 1024;

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(
      new ApiError(httpStatus.BAD_REQUEST, 'Please upload an excel file'),
      false,
    );
  } else if (maxFileSize < file.size) {
    return cb(
      new ApiError(
        httpStatus.BAD_REQUEST,
        'File size should be less than 10MB',
      ),
      false,
    );
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 },
});

module.exports = upload;
