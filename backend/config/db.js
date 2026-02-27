const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require("path");
dotenv.config({ path: path.resolve(__dirname, "../.env") });
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Successfully connected to MySQL");
    connection.release();
  } catch (error) {
    console.error("MySQL connection failed:", error.message);
  }
})();
module.exports = pool;