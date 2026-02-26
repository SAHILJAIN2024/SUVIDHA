const pool = require('../config/db');
const getDashboard = async (req, res, next) => {
  try {
    const [connections] = await pool.query('SELECT * FROM gas_connections WHERE user_id = ?', [req.user.id]);
    const [bills] = await pool.query('SELECT * FROM gas_bills WHERE user_id = ? ORDER BY created_at DESC LIMIT 12', [req.user.id]);
    res.json({ success: true, data: { connections, bills } });
  } catch (error) { next(error); }
};
const createRequest = async (req, res, next) => {
  try {
    const { request_type, subject, description } = req.body;
    const [result] = await pool.query(
      `INSERT INTO service_requests (user_id, service_type, request_type, subject, description) VALUES (?, 'gas', ?, ?, ?)`,
      [req.user.id, request_type, subject, description]
    );
    res.status(201).json({ success: true, message: 'Request created', requestId: result.insertId });
  } catch (error) { next(error); }
};
const getRequests = async (req, res, next) => {
  try {
    const [requests] = await pool.query(
      `SELECT sr.*, a.name as authority_name FROM service_requests sr LEFT JOIN authorities a ON sr.assigned_authority_id = a.id WHERE sr.user_id = ? AND sr.service_type = 'gas' ORDER BY sr.created_at DESC`,
      [req.user.id]
    );
    res.json({ success: true, data: requests });
  } catch (error) { next(error); }
};
const getAuthorities = async (req, res, next) => {
  try {
    const [authorities] = await pool.query("SELECT * FROM authorities WHERE service_type = 'gas'");
    res.json({ success: true, data: authorities });
  } catch (error) { next(error); }
};
const getActionsPending = async (req, res, next) => {
  try {
    const [pending] = await pool.query(
      `SELECT * FROM service_requests WHERE user_id = ? AND service_type = 'gas' AND status IN ('pending', 'in_progress') ORDER BY created_at DESC`,
      [req.user.id]
    );
    res.json({ success: true, data: pending });
  } catch (error) { next(error); }
};
const uploadDocument = async (req, res, next) => {
  try {
    const { document_type, service_request_id } = req.body;
    const file = req.file;
    if (!file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const [result] = await pool.query(
      `INSERT INTO documents (user_id, service_request_id, document_type, file_path, original_name) VALUES (?, ?, ?, ?, ?)`,
      [req.user.id, service_request_id, document_type, file.path, file.originalname]
    );
    res.status(201).json({ success: true, message: 'Document uploaded', documentId: result.insertId });
  } catch (error) { next(error); }
};
const getLeakAlerts = async (req, res, next) => {
  try {
    const [alerts] = await pool.query(
      "SELECT * FROM gas_leak_alerts WHERE status != 'resolved' ORDER BY created_at DESC"
    );
    res.json({ success: true, data: alerts });
  } catch (error) { next(error); }
};
const createLeakAlert = async (req, res, next) => {
  try {
    const { zone, location, severity } = req.body;
    const [result] = await pool.query(
      `INSERT INTO gas_leak_alerts (zone, location, severity, reported_by, status) VALUES (?, ?, ?, ?, 'reported')`,
      [zone, location, severity || 'medium', req.user.id]
    );
    res.status(201).json({ success: true, message: 'Gas leak alert reported', alertId: result.insertId });
  } catch (error) { next(error); }
};
module.exports = { getDashboard, createRequest, getRequests, getAuthorities, getActionsPending, uploadDocument, getLeakAlerts, createLeakAlert };
