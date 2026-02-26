const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { validationResult } = require('express-validator');
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};
// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    const { name, email, password, phone, dob, gender, adhaar_no, gas_no, ivrs_no, address } = req.body;
    // Check if user exists
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Insert user
    const [result] = await pool.query(
      `INSERT INTO users (name, email, password, phone, dob, gender, adhaar_no, gas_no, ivrs_no)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, email, hashedPassword, phone, dob, gender, adhaar_no, gas_no, ivrs_no]
    );
    const userId = result.insertId;
    // Insert address if provided
    if (address) {
      await pool.query(
        `INSERT INTO user_addresses (user_id, state, city, area_locality, pincode)
         VALUES (?, ?, ?, ?, ?)`,
        [userId, address.state, address.city, address.area, address.pincode]
      );
    }
    const token = generateToken({ id: userId, email, role: 'user' });
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: { id: userId, name, email, role: 'user' },
    });
  } catch (error) {
    next(error);
  }
};
// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    const { email, password } = req.body;
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    const token = generateToken(user);
    res.json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};
// GET /api/auth/profile
const getProfile = async (req, res, next) => {
  try {
    const [users] = await pool.query(
      'SELECT id, name, email, phone, dob, gender, adhaar_no, gas_no, ivrs_no, role, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const [addresses] = await pool.query('SELECT * FROM user_addresses WHERE user_id = ?', [req.user.id]);
    res.json({ success: true, user: { ...users[0], addresses } });
  } catch (error) {
    next(error);
  }
};
// PUT /api/auth/profile
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, dob, gender, gas_no, ivrs_no } = req.body;
    await pool.query(
      'UPDATE users SET name = ?, phone = ?, dob = ?, gender = ?, gas_no = ?, ivrs_no = ? WHERE id = ?',
      [name, phone, dob, gender, gas_no, ivrs_no, req.user.id]
    );
    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    next(error);
  }
};
module.exports = { register, login, getProfile, updateProfile };
