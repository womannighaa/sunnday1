import { Search, Heart, X, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import ImageCarousel from './ImageCarousel';
import CartPanel from './CartPanel';

interface HeaderProps {
  onCategoryChange: (category: string) => void;
  currentCategory: string;
  onSearch: (query: string) => void;
}

export default function Header({ onCategoryChange, currentCategory, onSearch }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { getItemCount } = useCart();
  const { getWishlistCount } = useWishlist();

  const categories = [
    { name: 'Home', value: 'all' },
    { name: 'Shop', value: 'all' },
    { name: 'Men', value: 'men' },
    { name: 'Women', value: 'women' },
    { name: 'Unisex', value: 'unisex' },
  ];

  const carouselImages = [
    'https://images.pexels.com/photos/3622613/pexels-photo-3622613.jpeg?w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/2769274/pexels-photo-2769274.jpeg?w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/3622613/pexels-photo-3622613.jpeg?w=600&h=400&fit=crop',
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
    setIsSearchOpen(false);
  };

  const cartCount = getItemCount();
  const wishlistCount = getWishlistCount();

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="flex-1 md:flex-none">
              <h1
                onClick={() => onCategoryChange('all')}
                className="text-lg md:text-2xl font-bold tracking-tight cursor-pointer hover:opacity-70 transition-opacity whitespace-nowrap"
                style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
              >
                Eddjos Collections
              </h1>
            </div>

            <nav className="hidden md:flex ml-auto space-x-6">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => onCategoryChange(cat.value)}
                  className={`text-sm font-medium transition-colors ${
                    currentCategory === cat.value
                      ? 'text-black border-b-2 border-black'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </nav>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Search className="w-5 h-5 text-gray-700" />
              </button>
              <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Heart className="w-5 h-5 text-gray-700" />
                {wishlistCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {wishlistCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ShoppingCart className="w-5 h-5 text-gray-700" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => {
                    onCategoryChange(cat.value);
                    setIsMenuOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    currentCategory === cat.value ? 'bg-gray-50 font-medium' : 'text-gray-600'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}

          <div className="hidden md:block pb-4">
            <ImageCarousel images={carouselImages} />
          </div>
        </div>

        {isSearchOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  autoFocus
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="p-3 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-700" />
                </button>
              </form>
            </div>
          </div>
        )}
      </header>

      {isCartOpen && <CartPanel onClose={() => setIsCartOpen(false)} />}
    </>
  );
}
