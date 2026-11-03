const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const env = require("./config/env");
const healthRoutes = require("./routes/health.routes");
const productRoutes = require("./routes/products.routes");

const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    // Requests without an Origin header include curl and server-to-server calls.
    if (!origin || env.corsOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Origin is not allowed by CORS."));
  }
}));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false, limit: "1mb" }));

app.use("/api", rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: "draft-7",
  legacyHeaders: false
}));

app.get("/", (_req, res) => {
  res.json({ success: true, name: "eBuy Rwanda API", version: "v1" });
});
app.use("/health", healthRoutes);
app.use("/api/v1/products", productRoutes);

app.use((_req, res) => {
  res.status(404).json({ success: false, message: "The requested API route was not found." });
});

app.use((error, _req, res, _next) => {
  if (error.message === "Origin is not allowed by CORS.") {
    return res.status(403).json({ success: false, message: error.message });
  }
  console.error(error);
  const status = Number.isInteger(error.status) ? error.status : 500;
  res.status(status).json({
    success: false,
    message: status >= 500 ? "An unexpected server error occurred." : error.message
  });
});

module.exports = app;
