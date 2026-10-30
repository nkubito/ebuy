# eBuy API

Node.js and Express API for the eBuy Rwanda marketplace.

## Requirements

- Node.js 20 or newer
- MySQL 8.0 or compatible
- npm

## Setup

1. Open a terminal in the `backend` directory.
2. Install dependencies: `npm install`.
3. Copy `.env.example` to `.env` and enter your local MySQL settings.
4. Create the database and tables by running `database/schema.sql` in MySQL Workbench or the MySQL command line.
5. Start the API: `npm run dev`.

The API starts on port 5000 by default. Keep `.env` private and never commit it.

## Routes

- `GET /` — API information
- `GET /health/live` — process liveness check
- `GET /health/ready` — checks database connectivity
- `GET /api/v1/products` — active in-stock product listing

Product query parameters: `search`, `category` (category slug), `page`, `limit` (maximum 50), and `sort` (`newest`, `price-low`, `price-high`, `name`).

## Security foundations

- Helmet security headers
- Explicit CORS allowlist
- API request rate limiting
- Parameterized SQL queries
- Environment-based database credentials
- No payment credentials or customer secrets in source control

Authentication, seller authorization, validation schemas, product write operations, orders and payment integration are future development stages. Do not expose this API to production until those features and automated tests are implemented.
