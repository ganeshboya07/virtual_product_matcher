/*
  # Visual Product Matcher - Products Schema

  1. New Tables
    - `products`
      - `id` (uuid, primary key) - Unique product identifier
      - `name` (text) - Product name
      - `category` (text) - Product category (e.g., electronics, fashion, furniture)
      - `description` (text) - Product description
      - `image_url` (text) - URL to product image
      - `price` (numeric) - Product price
      - `brand` (text) - Brand name
      - `color` (text) - Primary color
      - `created_at` (timestamptz) - Creation timestamp
  
  2. Security
    - Enable RLS on `products` table
    - Add policy for public read access (product catalog is public)
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  description text DEFAULT '',
  image_url text NOT NULL,
  price numeric(10, 2) DEFAULT 0,
  brand text DEFAULT '',
  color text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products"
  ON products
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_color ON products(color);