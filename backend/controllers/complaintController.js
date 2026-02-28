const pool = require('../config/db');
const generateTicketId = () => {
  const prefix = 'CMP';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};
// POST /api/complaints
const createComplaint = async (req, res, next) => {
  try {
    const { category, complaint_type, subject, location} = req.body;
    const ticket_id = generateTicketId();
    // const image_path = req.file ? req.file.path : null;
    const [result] = await pool.query(
      `INSERT INTO complaints (user_id, ticket_id, category, complaint_type, subject, location)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [req.user.id, ticket_id, category, complaint_type, subject, location]
    );
    res.status(201).json({ success: true, message: 'Complaint filed', ticketId: ticket_id, complaintId: result.insertId });
  } catch (error) { next(error); }
};
// GET /api/complaints
const getComplaints = async (req, res, next) => {
  try {
    const [complaints] = await pool.query(
      `SELECT c.*, a.name as authority_name FROM complaints c
       LEFT JOIN authorities a ON c.assigned_authority_id = a.id
       WHERE c.user_id = ? ORDER BY c.created_at DESC`,
      [req.user.id]
    );
    res.json({ success: true, data: complaints });
  } catch (error) { next(error); }
};
// GET /api/complaints/public - Transparent Dashboard
const getPublicComplaints = async (req, res, next) => {
  try {
    const { status, category, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    let query = `SELECT c.ticket_id, c.category, c.complaint_type, c.subject, c.location, c.status, c.priority, c.assigned_station, c.created_at, c.resolved_at, a.name as authority_name
       FROM complaints c LEFT JOIN authorities a ON c.assigned_authority_id = a.id WHERE 1=1`;
    const params = [];
    if (status) { query += ' AND c.status = ?'; params.push(status); }
    if (category) { query += ' AND c.category = ?'; params.push(category); }
    query += ' ORDER BY c.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    const [complaints] = await pool.query(query, params);
    const [[{ total }]] = await pool.query('SELECT COUNT(*) as total FROM complaints');
    res.json({ success: true, data: complaints, pagination: { page: parseInt(page), limit: parseInt(limit), total } });
  } catch (error) { next(error); }
};
// GET /api/complaints/:id
const getComplaintById = async (req, res, next) => {
  try {
    const [complaints] = await pool.query(
      `SELECT c.*, a.name as authority_name FROM complaints c
       LEFT JOIN authorities a ON c.assigned_authority_id = a.id
       WHERE c.id = ? AND c.user_id = ?`,
      [req.params.id, req.user.id]
    );
    if (complaints.length === 0) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }
    const [updates] = await pool.query(
      'SELECT cu.*, u.name as updated_by_name FROM complaint_updates cu LEFT JOIN users u ON cu.updated_by = u.id WHERE cu.complaint_id = ? ORDER BY cu.created_at DESC',
      [req.params.id]
    );
    res.json({ success: true, data: { ...complaints[0], updates } });
  } catch (error) { next(error); }
};
// PUT /api/complaints/:id (admin)
const updateComplaint = async (req, res, next) => {
  try {
    const { status, remarks, assigned_authority_id, assigned_station, priority } = req.body;
    await pool.query(
      `UPDATE complaints SET status = COALESCE(?, status), assigned_authority_id = COALESCE(?, assigned_authority_id),
       assigned_station = COALESCE(?, assigned_station), priority = COALESCE(?, priority),
       resolved_at = IF(? = 'resolved', NOW(), resolved_at) WHERE id = ?`,
      [status, assigned_authority_id, assigned_station, priority, status, req.params.id]
    );
    if (status || remarks) {
      await pool.query(
        'INSERT INTO complaint_updates (complaint_id, updated_by, status, remarks) VALUES (?, ?, ?, ?)',
        [req.params.id, req.user.id, status, remarks]
      );
    }
    res.json({ success: true, message: 'Complaint updated' });
  } catch (error) { next(error); }
};
module.exports = { createComplaint, getComplaints, getPublicComplaints, getComplaintById, updateComplaint };