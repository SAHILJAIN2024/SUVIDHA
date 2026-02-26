const pool = require('../config/db');
const getDashboard = async (req, res, next) => {
  try {
    const [connections] = await pool.query('SELECT * FROM water_connections WHERE user_id = ?', [req.user.id]);
    const [bills] = await pool.query('SELECT * FROM water_bills WHERE user_id = ? ORDER BY created_at DESC LIMIT 12', [req.user.id]);
    res.json({ success: true, data: { connections, bills } });
  } catch (error) { next(error); }
};
const createRequest = async (req, res, next) => {
  try {
    const { request_type, subject, description } = req.body;
    const [result] = await pool.query(
      `INSERT INTO service_requests (user_id, service_type, request_type, subject, description) VALUES (?, 'water', ?, ?, ?)`,
      [req.user.id, request_type, subject, description]
    );
    res.status(201).json({ success: true, message: 'Request created', requestId: result.insertId });
  } catch (error) { next(error); }
};
const getRequests = async (req, res, next) => {
  try {
    const [requests] = await pool.query(
      `SELECT sr.*, a.name as authority_name FROM service_requests sr LEFT JOIN authorities a ON sr.assigned_authority_id = a.id WHERE sr.user_id = ? AND sr.service_type = 'water' ORDER BY sr.created_at DESC`,
      [req.user.id]
    );
    res.json({ success: true, data: requests });
  } catch (error) { next(error); }
};
const getAuthorities = async (req, res, next) => {
  try {
    const [authorities] = await pool.query("SELECT * FROM authorities WHERE service_type = 'water'");
    res.json({ success: true, data: authorities });
  } catch (error) { next(error); }
};
const getActionsPending = async (req, res, next) => {
  try {
    const [pending] = await pool.query(
      `SELECT * FROM service_requests WHERE user_id = ? AND service_type = 'water' AND status IN ('pending', 'in_progress') ORDER BY created_at DESC`,
      [req.user.id]
    );
    res.json({ success: true, data: pending });
  } catch (error) { next(error); }
};
const getSupplyStatus = async (req, res, next) => {
  try {
    const [status] = await pool.query(
      "SELECT * FROM water_supply_status WHERE supply_status != 'normal' ORDER BY created_at DESC"
    );
    res.json({ success: true, data: status });
  } catch (error) { next(error); }
};
module.exports = { getDashboard, createRequest, getRequests, getAuthorities, getActionsPending, getSupplyStatus };