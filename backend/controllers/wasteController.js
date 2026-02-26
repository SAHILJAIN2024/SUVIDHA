const pool = require('../config/db');
const getDashboard = async (req, res, next) => {
  try {
    const [collections] = await pool.query(
      'SELECT wc.*, wz.zone_name, wz.collection_schedule FROM waste_collections wc JOIN waste_zones wz ON wc.zone_id = wz.id WHERE wc.user_id = ? ORDER BY wc.pickup_date DESC',
      [req.user.id]
    );
    res.json({ success: true, data: { collections } });
  } catch (error) { next(error); }
};
const createRequest = async (req, res, next) => {
  try {
    const { request_type, subject, description } = req.body;
    const [result] = await pool.query(
      `INSERT INTO service_requests (user_id, service_type, request_type, subject, description) VALUES (?, 'waste', ?, ?, ?)`,
      [req.user.id, request_type, subject, description]
    );
    res.status(201).json({ success: true, message: 'Request created', requestId: result.insertId });
  } catch (error) { next(error); }
};
const getRequests = async (req, res, next) => {
  try {
    const [requests] = await pool.query(
      `SELECT * FROM service_requests WHERE user_id = ? AND service_type = 'waste' ORDER BY created_at DESC`,
      [req.user.id]
    );
    res.json({ success: true, data: requests });
  } catch (error) { next(error); }
};
const getSchedule = async (req, res, next) => {
  try {
    const [zones] = await pool.query('SELECT * FROM waste_zones ORDER BY zone_name');
    res.json({ success: true, data: zones });
  } catch (error) { next(error); }
};
module.exports = { getDashboard, createRequest, getRequests, getSchedule };
