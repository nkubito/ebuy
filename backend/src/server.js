const app = require("./app");
const env = require("./config/env");
const { pool, checkDatabaseConnection } = require("./config/database");

let server;

async function start() {
  try {
    await checkDatabaseConnection();
    console.log("MySQL connection established.");
  } catch (error) {
    console.error("Could not connect to MySQL. Check backend/.env and make sure MySQL is running.");
    console.error(error.message);
    process.exit(1);
  }

  server = app.listen(env.port, () => {
    console.log(`eBuy API listening on port ${env.port} (${env.nodeEnv}).`);
  });
}

async function shutdown(signal) {
  console.log(`${signal} received. Shutting down eBuy API...`);
  if (server) {
    server.close(async () => {
      await pool.end();
      process.exit(0);
    });
  } else {
    await pool.end();
    process.exit(0);
  }
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

start();
