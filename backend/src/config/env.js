const path = require("node:path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

function required(name, fallback) {
  const value = process.env[name] ?? fallback;
  if (value === undefined || value === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  corsOrigins: (process.env.CORS_ORIGIN || "http://localhost:5500,http://127.0.0.1:5500,http://localhost:5173")
    .split(",").map((origin) => origin.trim()).filter(Boolean),
  database: {
    host: required("DB_HOST", "127.0.0.1"),
    port: Number(required("DB_PORT", "3306")),
    name: required("DB_NAME", "ebuy"),
    user: required("DB_USER", "root"),
    password: process.env.DB_PASSWORD || "",
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10)
  }
};

if (!Number.isInteger(env.port) || env.port < 1 || env.port > 65535) {
  throw new Error("PORT must be a valid TCP port.");
}

module.exports = env;
