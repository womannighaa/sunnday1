/*
  # Eddjos Collections Product Catalog Schema

  1. New Tables
    - `categories` - Product category reference table
    - `products` - Main product catalog with all clothing items
  
  2. Security
    - RLS enabled with public read access (no authentication required)
  
  3. Indexes
    - Optimized for category, featured, and stock status queries
*/

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('men', 'women', 'unisex')),
  subcategory text,
  description text,
  price numeric NOT NULL CHECK (price >= 0),
  colors text[] DEFAULT '{}',
  sizes text[] DEFAULT '{}',
  image_url text,
  featured boolean DEFAULT false,
  in_stock boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products(in_stock) WHERE in_stock = true;
CREATE INDEX IF NOT EXISTS idx_products_subcategory ON products(subcategory);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are publicly readable"
  ON categories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Products are publicly readable"
  ON products FOR SELECT
  TO public
  USING (true);

INSERT INTO categories (name, slug, display_order) VALUES
  ('Men', 'men', 1),
  ('Women', 'women', 2),
  ('Unisex', 'unisex', 3)
ON CONFLICT (name) DO NOTHING;