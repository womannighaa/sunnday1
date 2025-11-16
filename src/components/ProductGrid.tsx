import { useState, useEffect } from 'react';
import { supabase, Product } from '../lib/supabase';
import ProductCard from './ProductCard';
import PriceFilter from './PriceFilter';
import ReviewsCarousel from './ReviewsCarousel';
import { Filter } from 'lucide-react';

interface Review {
  id: string;
  rating: number;
  review_text: string;
}

interface ProductGridProps {
  category: string;
  searchQuery?: string;
}

export default function ProductGrid({ category, searchQuery }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchReviews();
  }, [category, searchQuery]);

  async function fetchProducts() {
    setLoading(true);
    try {
      let query = supabase
        .from('products')
        .select('*')
        .eq('in_stock', true)
        .order('sort_order', { ascending: true });

      if (category !== 'all') {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) throw error;

      setProducts(data || []);

      const uniqueSubcategories = [
        ...new Set(
          (data || [])
            .map((p) => p.subcategory)
            .filter((s): s is string => s !== null)
        ),
      ];
      setSubcategories(uniqueSubcategories);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchReviews() {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  }

  let filteredProducts = products;

  if (selectedSubcategory !== 'all') {
    filteredProducts = filteredProducts.filter((p) => p.subcategory === selectedSubcategory);
  }

  filteredProducts = filteredProducts.filter((p) => {
    const price = p.discounted_price || p.price;
    return price >= minPrice && price <= maxPrice;
  });

  if (searchQuery && searchQuery.trim() !== '') {
    const query = searchQuery.toLowerCase();
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        (p.subcategory && p.subcategory.toLowerCase().includes(query)) ||
        (p.description && p.description.toLowerCase().includes(query))
    );
  }

  const maxProductPrice = Math.max(
    ...products.map((p) => p.discounted_price || p.price),
    100000
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          <div className="hidden lg:block lg:w-64">
            <PriceFilter
              onFilterChange={(min, max) => {
                setMinPrice(min);
                setMaxPrice(max);
              }}
              maxAvailable={maxProductPrice}
              isOpen={true}
            />
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold">
                  {category === 'all'
                    ? 'All Products'
                    : category.charAt(0).toUpperCase() + category.slice(1)}
                </h2>
                <p className="text-gray-600 mt-1">{filteredProducts.length} items</p>
              </div>

              <button
                onClick={() => setFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-5 h-5" />
                Filter
              </button>
            </div>

            {filterOpen && (
              <div className="lg:hidden mb-6">
                <PriceFilter
                  onFilterChange={(min, max) => {
                    setMinPrice(min);
                    setMaxPrice(max);
                  }}
                  maxAvailable={maxProductPrice}
                  isOpen={filterOpen}
                  onClose={() => setFilterOpen(false)}
                />
              </div>
            )}

            {subcategories.length > 0 && (
              <div className="flex gap-2 flex-wrap mb-8">
                <button
                  onClick={() => setSelectedSubcategory('all')}
                  className={`px-4 py-2 text-sm border rounded transition-all ${
                    selectedSubcategory === 'all'
                      ? 'border-black bg-black text-white'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  All
                </button>
                {subcategories.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubcategory(sub)}
                    className={`px-4 py-2 text-sm border rounded transition-all ${
                      selectedSubcategory === sub
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            )}

            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">No products available in this category yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {reviews.length > 0 && <ReviewsCarousel reviews={reviews} />}
          </div>
        </div>
      </div>
    </section>
  );
}
