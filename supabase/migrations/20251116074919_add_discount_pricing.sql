/*
  # Add Discount Pricing to Products

  1. Changes
    - Add original_price column to store the full original price
    - Add discounted_price column to store the sale/discounted price
    - These fields allow displaying both crossed-out original price and current discounted price
  
  2. Notes
    - original_price: The full non-discounted price (optional)
    - discounted_price: The current sale price to display (optional)
    - When both are present, show original_price crossed out with discounted_price as current
    - When only price exists, use that as the current price
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'original_price'
  ) THEN
    ALTER TABLE products ADD COLUMN original_price numeric DEFAULT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'discounted_price'
  ) THEN
    ALTER TABLE products ADD COLUMN discounted_price numeric DEFAULT NULL;
  END IF;
END $$;
