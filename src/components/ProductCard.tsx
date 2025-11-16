import { ShoppingCart, Heart } from 'lucide-react';
import { useState } from 'react';
import { Product } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import ProductDetailModal from './ProductDetailModal';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [showDetail, setShowDetail] = useState(false);
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const isLiked = isInWishlist(product.id);

  const displayPrice = product.discounted_price || product.price;
  const originalPrice = product.original_price;
  const showDiscount = originalPrice && originalPrice > displayPrice;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.in_stock) return;

    addToCart({
      productId: product.id,
      productName: product.name,
      price: displayPrice as number,
      quantity: 1,
      image_url: product.image_url || undefined,
    });
    alert('Added to cart!');
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLiked) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  return (
    <>
      <div
        onClick={() => product.in_stock && setShowDetail(true)}
        className={`relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 ${
          product.in_stock ? 'cursor-pointer' : 'opacity-60 cursor-not-allowed'
        }`}
      >
        <div className="aspect-square bg-gray-100 overflow-hidden relative group">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span className="text-6xl">👕</span>
            </div>
          )}

          {!product.in_stock && (
            <div className="absolute inset-0 bg-red-500/20 backdrop-blur-sm flex items-center justify-center">
              <span className="text-white font-bold text-lg line-through">Out of Stock</span>
            </div>
          )}

          {product.in_stock && (
            <>
              <button
                onClick={handleQuickAdd}
                className="absolute top-3 right-3 bg-white hover:bg-blue-600 hover:text-white text-gray-700 p-2 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 opacity-0 group-hover:opacity-100"
              >
                <ShoppingCart className="w-5 h-5" />
              </button>

              <button
                onClick={handleToggleWishlist}
                className={`absolute top-3 left-3 p-2 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 opacity-0 group-hover:opacity-100 ${
                  isLiked
                    ? 'bg-red-500 text-white'
                    : 'bg-white hover:bg-red-100 text-gray-700'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </button>
            </>
          )}

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 translate-y-0 group-hover:translate-y-0 transition-transform duration-300">
            <div className="text-white space-y-1">
              {showDiscount ? (
                <>
                  <p className="text-sm line-through opacity-75">
                    KSh {originalPrice?.toLocaleString()}
                  </p>
                  <p className="text-2xl font-bold">
                    KSh {displayPrice?.toLocaleString()}
                  </p>
                </>
              ) : (
                <p className="text-2xl font-bold">
                  KSh {displayPrice?.toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-medium text-lg text-gray-900 line-clamp-2">
            {product.name}
          </h3>
        </div>
      </div>

      {showDetail && <ProductDetailModal product={product} onClose={() => setShowDetail(false)} />}
    </>
  );
}
