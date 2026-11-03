const express = require("express");
const { checkDatabaseConnection } = require("../config/database");

const router = express.Router();

router.get("/live", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "eBuy API is running.",
    timestamp: new Date().toISOString()
  });
});

router.get("/ready", async (_req, res, next) => {
  try {
    await checkDatabaseConnection();
    res.status(200).json({
      success: true,
      message: "API and database are ready."
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
