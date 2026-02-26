const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
// Allowed MIME types
const ALLOWED_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/webp'],
  document: ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'],
};
// Max file sizes (in bytes)
const MAX_SIZE = {
  image: 5 * 1024 * 1024,    // 5MB
  document: 10 * 1024 * 1024, // 10MB
};
// Use random filenames to prevent path traversal
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const randomName = crypto.randomBytes(16).toString('hex');
    cb(null, `${randomName}${ext}`);
  },
});
const createUploader = (type = 'document') => {
  return multer({
    storage,
    limits: { fileSize: MAX_SIZE[type] || MAX_SIZE.document },
    fileFilter: (req, file, cb) => {
      const allowed = ALLOWED_TYPES[type] || ALLOWED_TYPES.document;
      if (allowed.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error(`Invalid file type. Allowed: ${allowed.join(', ')}`), false);
      }
    },
  });
};
module.exports = { createUploader };
