-- eBuy marketplace category expansion
-- Run this once against an existing eBuy database.
-- INSERT IGNORE keeps existing category rows and is safe to re-run.

USE ebuy;

INSERT IGNORE INTO categories (name, slug, description) VALUES
  ('Food & Groceries', 'food-groceries', 'Fresh food, pantry items, drinks and everyday groceries'),
  ('Home Essentials', 'home-essentials', 'Cleaning supplies, laundry products and household basics'),
  ('Kitchen & Dining', 'kitchen-dining', 'Cookware, utensils, tableware and dining essentials'),
  ('Furniture & Decor', 'furniture-decor', 'Furniture, lighting, textiles and home decoration'),
  ('Beauty & Personal Care', 'beauty-personal-care', 'Beauty, skincare, toiletries and personal care products'),
  ('Baby & Kids', 'baby-kids', 'Baby care, children clothing, toys and family essentials');
