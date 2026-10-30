const mysql = require("mysql2/promise");
const env = require("./env");

const pool = mysql.createPool({
  host: env.database.host,
  port: env.database.port,
  database: env.database.name,
  user: env.database.user,
  password: env.database.password,
  waitForConnections: true,
  connectionLimit: env.database.connectionLimit,
  queueLimit: 0,
  charset: "utf8mb4",
  decimalNumbers: true
});

async function checkDatabaseConnection() {
  const connection = await pool.getConnection();
  try {
    await connection.ping();
  } finally {
    connection.release();
  }
}

module.exports = { pool, checkDatabaseConnection };
