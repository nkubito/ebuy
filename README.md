# eBuy Rwanda

A marketplace storefront concept for Rwanda, designed to connect customers with independent local sellers. The primary display currency is Rwandan francs (RWF).

## Current status

This repository currently contains a front-end prototype. The marketplace UI is being developed in phases; customer accounts, seller onboarding, product persistence, order management, delivery workflows and payment processing require a backend and are **not yet live**.

## Run locally

No build step is required for the current static storefront.

1. Clone the repository.
2. Open `index.html` in a browser, or serve the folder with a local static server.
3. The storefront uses plain HTML, CSS and JavaScript.

## Current storefront features

- Responsive marketplace landing page and category browsing
- Dedicated product details page and FAQ page
- Product search, category filters and sorting
- Sample product cards with RWF pricing and seller labels
- Cart with quantity controls and browser localStorage persistence
- Wishlist interactions for the current session
- Seller call-to-action and clear demo-only checkout messaging

## Planned marketplace architecture

1. **Identity and access:** customer accounts, seller accounts, admin roles and secure authentication.
2. **Seller operations:** seller applications, approval, store profiles and seller product management.
3. **Catalog:** persistent products, categories, inventory, product images and moderation.
4. **Orders:** checkout, order lifecycle, seller fulfilment, cancellations and returns.
5. **Payments:** integrate a licensed payment provider after merchant onboarding and credentials are confirmed. Never store card details or mobile-money PINs.
6. **Delivery:** delivery zones, fees, tracking and proof of delivery.
7. **Administration:** seller approval, catalog moderation, order oversight, refunds and reporting.

## Important implementation notes

- Sample products and prices in `app.js` are demonstration data, not live seller listings.
- Cart data is stored only in the visitor's browser and is not an order.
- No payment is collected by this prototype.
- External product photography is loaded from Unsplash; replace it with seller-authorized product images before production.
- Do not commit secrets, API keys, passwords or production credentials.

## Development

Work on feature branches and review changes before merging into `main`. Add automated tests and CI checks as the backend and production workflows are introduced.


## Backend API

The first backend foundation is in `backend/`.

- Read [backend setup instructions](backend/README.md).
- Configure `backend/.env` from `backend/.env.example`.
- Create the MySQL schema using `backend/database/schema.sql`.
- Start the API from the backend directory with `npm install` and `npm run dev`.

The API currently provides health checks and a read-only product listing. The storefront still uses sample product data until the API and production catalog are connected. Do not treat the demo cart as a submitted order or payment.
