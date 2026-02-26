const { body, param, query, validationResult } = require('express-validator');
// Centralized validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};
// --- Auth Validations ---
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required')
    .isLength({ max: 100 }).withMessage('Name must be under 100 characters')
    .matches(/^[a-zA-Z\s.'-]+$/).withMessage('Name contains invalid characters'),
  body('email').trim().isEmail().normalizeEmail().withMessage('Valid email is required')
    .isLength({ max: 150 }).withMessage('Email too long'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/).withMessage('Password must contain uppercase, lowercase, number, and special character'),
  body('phone').optional().isMobilePhone('any').withMessage('Invalid phone number'),
  body('adhaar_no').optional().isLength({ min: 12, max: 12 }).isNumeric().withMessage('Aadhaar must be 12 digits'),
  body('gas_no').optional().isLength({ max: 50 }).trim().escape(),
  body('ivrs_no').optional().isLength({ max: 50 }).trim().escape(),
  body('dob').optional().isISO8601().withMessage('Invalid date format'),
  body('gender').optional().isIn(['Male', 'Female', 'Other']).withMessage('Invalid gender'),
  handleValidationErrors,
];
const loginValidation = [
  body('email').trim().isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];
// --- Service Request Validations ---
const serviceRequestValidation = [
  body('request_type').isIn(['new_connection', 'maintenance', 'disconnection', 'update', 'other']).withMessage('Invalid request type'),
  body('subject').trim().notEmpty().isLength({ max: 200 }).withMessage('Subject required (max 200 chars)'),
  body('description').optional().trim().isLength({ max: 2000 }).withMessage('Description too long'),
  handleValidationErrors,
];
// --- Gas Leak Alert Validations ---
const gasLeakAlertValidation = [
  body('zone').trim().notEmpty().isLength({ max: 50 }).withMessage('Zone is required (max 50 chars)'),
  body('location').trim().notEmpty().isLength({ max: 500 }).withMessage('Location is required (max 500 chars)'),
  body('severity').optional().isIn(['low', 'medium', 'high', 'critical']).withMessage('Invalid severity level'),
  handleValidationErrors,
];
// --- Complaint Validations ---
const complaintValidation = [
  body('category').isIn(['street_light', 'pothole', 'broken_road', 'drainage', 'garbage', 'water_leakage', 'other']).withMessage('Invalid category'),
  body('complaint_type').optional().isIn(['personal', 'global']),
  body('subject').trim().notEmpty().isLength({ max: 200 }).withMessage('Subject required (max 200 chars)'),
  body('description').optional().trim().isLength({ max: 2000 }),
  body('location').optional().trim().isLength({ max: 500 }),
  body('latitude').optional().isDecimal(),
  body('longitude').optional().isDecimal(),
  handleValidationErrors,
];
// --- Payment Validations ---
const paymentValidation = [
  body('amount').isFloat({ min: 1, max: 1000000 }).withMessage('Amount must be between 1 and 10,00,000'),
  body('service_type').isIn(['electricity', 'gas', 'water', 'waste', 'municipal']).withMessage('Invalid service type'),
  body('bill_id').optional().isInt({ min: 1 }),
  handleValidationErrors,
];
// --- ID Parameter Validation ---
const idParamValidation = [
  param('id').isInt({ min: 1 }).withMessage('Invalid ID'),
  handleValidationErrors,
];
// --- Pagination Query Validation ---
const paginationValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100'),
  handleValidationErrors,
];
module.exports = {
  handleValidationErrors,
  registerValidation,
  loginValidation,
  serviceRequestValidation,
  gasLeakAlertValidation,
  complaintValidation,
  paymentValidation,
  idParamValidation,
  paginationValidation,
};