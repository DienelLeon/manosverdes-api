// src/utils/uploadImage.js
const multer = require('multer');

const fileFilter = (_req, file, cb) => {
  if (/^image\/(jpe?g|png|webp)$/i.test(file.mimetype)) {
    return cb(null, true);
  }
  cb(new Error("Archivo no permitido (solo JPG, PNG o WEBP)"));
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter
});

module.exports = upload;
