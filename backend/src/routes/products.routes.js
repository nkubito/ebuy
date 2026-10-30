const express = require("express");
const { pool } = require("../config/database");

const router = express.Router();

const allowedSorts = {
  newest: "p.created_at DESC",
  "price-low": "p.price_rwf ASC",
  "price-high": "p.price_rwf DESC",
  name: "p.name ASC"
};

// GET /api/v1/products?search=shoe&category=fashion&page=1&limit=12&sort=newest
router.get("/", async (req, res, next) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, Number.parseInt(req.query.limit, 10) || 12));
    const offset = (page - 1) * limit;
    const search = typeof req.query.search === "string" ? req.query.search.trim().slice(0, 100) : "";
    const category = typeof req.query.category === "string" ? req.query.category.trim().slice(0, 80) : "";
    const sort = allowedSorts[req.query.sort] ? req.query.sort : "newest";

    const conditions = ["p.status = 'active'", "p.stock_quantity > 0"];
    const values = [];

    if (search) {
      conditions.push("(p.name LIKE ? OR p.description LIKE ?)");
      values.push(`%${search}%`, `%${search}%`);
    }
    if (category) {
      conditions.push("c.slug = ?");
      values.push(category.toLowerCase());
    }

    const where = conditions.join(" AND ");
    const [rows] = await pool.execute(
      `SELECT p.id, p.name, p.slug, p.description, p.price_rwf, p.stock_quantity,
              p.image_url, c.name AS category_name, c.slug AS category_slug,
              s.store_name AS seller_name
       FROM products p
       INNER JOIN categories c ON c.id = p.category_id
       INNER JOIN seller_profiles s ON s.id = p.seller_id
       WHERE ${where}
       ORDER BY ${allowedSorts[sort]}
       LIMIT ? OFFSET ?`,
      [...values, limit, offset]
    );

    const [countRows] = await pool.execute(
      `SELECT COUNT(*) AS total
       FROM products p
       INNER JOIN categories c ON c.id = p.category_id
       WHERE ${where}`,
      values
    );

    const total = Number(countRows[0].total);
    res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
