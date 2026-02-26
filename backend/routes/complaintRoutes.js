const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { protect, adminOnly } = require('../middleware/auth');
const { complaintValidation, idParamValidation, paginationValidation } = require('../middleware/validate');
const { createUploader } = require('../middleware/fileUpload');
const ctrl = require('../controllers/complaintController');
// Public route - transparent dashboard (with pagination validation)
router.get('/public', paginationValidation, ctrl.getPublicComplaints);
// Protected routes
router.post('/', protect, createUploader('image').single('image'), complaintValidation, ctrl.createComplaint);
router.get('/', protect, ctrl.getComplaints);
router.get('/:id', protect, idParamValidation, ctrl.getComplaintById);
router.put('/:id', protect, adminOnly, idParamValidation, ctrl.updateComplaint);
module.exports = router;