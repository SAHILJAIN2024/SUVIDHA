const Razorpay = require('razorpay');
const crypto = require('crypto');
const pool = require('../config/db');
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
const generateReceiptNo = () => {
  return `RCP-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
};
// POST /api/payments/create-order
const createOrder = async (req, res, next) => {
  try {
    const { amount, service_type, bill_id } = req.body;
    if (!amount || !service_type) {
      return res.status(400).json({ success: false, message: 'Amount and service_type are required' });
    }
    const receipt_no = generateReceiptNo();
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt: receipt_no,
    });
    // Store in DB
    await pool.query(
      `INSERT INTO payments (user_id, service_type, bill_id, razorpay_order_id, amount, receipt_no)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [req.user.id, service_type, bill_id, order.id, amount, receipt_no]
    );
    res.json({
      success: true,
      order: { id: order.id, amount: order.amount, currency: order.currency },
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) { next(error); }
};
// POST /api/payments/verify
const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');
    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }
    // Update payment record
    await pool.query(
      `UPDATE payments SET razorpay_payment_id = ?, razorpay_signature = ?, status = 'paid', paid_at = NOW()
       WHERE razorpay_order_id = ?`,
      [razorpay_payment_id, razorpay_signature, razorpay_order_id]
    );
    // Get payment to update the corresponding bill
    const [payments] = await pool.query('SELECT * FROM payments WHERE razorpay_order_id = ?', [razorpay_order_id]);
    if (payments.length > 0) {
      const payment = payments[0];
      const billTable = `${payment.service_type}_bills`;
      if (['electricity', 'gas', 'water'].includes(payment.service_type) && payment.bill_id) {
        await pool.query(`UPDATE ${billTable} SET status = 'paid', paid_at = NOW() WHERE id = ?`, [payment.bill_id]);
      }
    }
    res.json({ success: true, message: 'Payment verified successfully' });
  } catch (error) { next(error); }
};
// GET /api/payments/history
const getPaymentHistory = async (req, res, next) => {
  try {
    const [payments] = await pool.query(
      'SELECT * FROM payments WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json({ success: true, data: payments });
  } catch (error) { next(error); }
};
// GET /api/payments/receipt/:id
const getReceipt = async (req, res, next) => {
  try {
    const [payments] = await pool.query(
      'SELECT p.*, u.name, u.email FROM payments p JOIN users u ON p.user_id = u.id WHERE p.id = ? AND p.user_id = ?',
      [req.params.id, req.user.id]
    );
    if (payments.length === 0) {
      return res.status(404).json({ success: false, message: 'Receipt not found' });
    }
    res.json({ success: true, data: payments[0] });
  } catch (error) { next(error); }
};
module.exports = { createOrder, verifyPayment, getPaymentHistory, getReceipt };