import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Product {
  id: string;
  name: string;
  category: 'men' | 'women' | 'unisex';
  subcategory: string | null;
  description: string | null;
  price: number;
  original_price: number | null;
  discounted_price: number | null;
  colors: string[];
  sizes: string[];
  image_url: string | null;
  featured: boolean;
  in_stock: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  display_order: number;
  created_at: string;
}
