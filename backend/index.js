const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { errorHandler } = require('./middleware/errorHandler');
const { securityHeaders } = require('./middleware/securityHeaders');
const { apiLimiter } = require('./middleware/rateLimiter');
const { sanitizeInputs } = require('./middleware/sanitize');

dotenv.config();
const app = express();

// ── Security Middleware ──
app.use(securityHeaders);                        // Helmet security headers
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400,                                 // Preflight cache 24h
}));
app.use(express.json({ limit: '1mb' }));         // Body size limit
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(sanitizeInputs);                         // XSS sanitization
app.use('/api', apiLimiter);                     // Global rate limit

app.disable('x-powered-by');


// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/electricity', require('./routes/electricityRoutes'));
app.use('/api/gas', require('./routes/gasRoutes'));
app.use('/api/water', require('./routes/waterRoutes'));
app.use('/api/waste', require('./routes/wasteRoutes'));
app.use('/api/complaints', require('./routes/complaintRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});
// Error handler (must be last)
app.use(errorHandler);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});