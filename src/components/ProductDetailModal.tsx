import { X, Heart, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Product } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { generateWhatsAppLink } from '../lib/whatsapp';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
}

export default function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const displayPrice = product.discounted_price || product.price;
  const originalPrice = product.original_price;
  const showDiscount = originalPrice && originalPrice > displayPrice;
  const isLiked = isInWishlist(product.id);

  const images = product.images && product.images.length > 0
    ? product.images
    : [product.image_url || 'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?w=800&h=800&fit=crop'];

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert('Please select size and color');
      return;
    }

    addToCart({
      productId: product.id,
      productName: product.name,
      price: displayPrice as number,
      quantity,
      selectedSize,
      selectedColor,
      image_url: product.image_url || undefined,
    });

    alert('Added to cart!');
  };

  const handleBuyNow = () => {
    if (selectedSize || selectedColor) {
      const link = generateWhatsAppLink(product.name, selectedSize, selectedColor);
      window.open(link, '_blank');
    } else {
      const link = generateWhatsAppLink(product.name);
      window.open(link, '_blank');
    }
  };

  const handleToggleWishlist = () => {
    if (isLiked) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div
        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-100 flex items-center justify-between p-4 z-10">
          <h2 className="text-xl font-bold">{product.name}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-square">
              <img
                src={images[mainImageIndex]}
                alt={`${product.name} view ${mainImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setMainImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setMainImageIndex((prev) => (prev + 1) % images.length)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setMainImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      index === mainImageIndex ? 'border-black' : 'border-gray-200'
                    }`}
                  >
                    <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600">Category</p>
                <p className="font-semibold capitalize">{product.category}</p>
              </div>
              {product.subcategory && (
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600">Type</p>
                  <p className="font-semibold">{product.subcategory}</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-baseline gap-2 mb-2">
                {showDiscount ? (
                  <>
                    <span className="text-3xl font-bold">KSh {displayPrice?.toLocaleString()}</span>
                    <span className="text-lg text-gray-400 line-through">
                      KSh {originalPrice?.toLocaleString()}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold">KSh {displayPrice?.toLocaleString()}</span>
                )}
              </div>
              {!product.in_stock && (
                <p className="text-red-600 font-semibold text-lg">Out of Stock</p>
              )}
            </div>

            {product.description && (
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div>
                <label className="block text-sm font-semibold mb-3">Size</label>
                <div className="grid grid-cols-4 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 px-3 rounded border-2 transition-colors font-medium text-sm ${
                        selectedSize === size
                          ? 'border-black bg-black text-white'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.colors && product.colors.length > 0 && (
              <div>
                <label className="block text-sm font-semibold mb-3">Color</label>
                <div className="flex gap-2 flex-wrap">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded border-2 transition-colors font-medium text-sm ${
                        selectedColor === color
                          ? 'border-black bg-black text-white'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold mb-2">Quantity</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  −
                </button>
                <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={!product.in_stock}
                className={`w-full py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors ${
                  product.in_stock
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                disabled={!product.in_stock}
                className={`w-full py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors ${
                  product.in_stock
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-5.031 1.378c-2.872 1.695-4.7 5.189-4.7 8.812 0 2.52.738 4.063 2.202 5.204.666.538 1.203.812 1.86.812.5 0 1.038-.194 1.57-.437 1.011-.44 1.966-1.059 2.686-1.543.321-.198.65-.38.926-.436.284-.057.635.053.835.353.55.852 1.007 1.772 1.348 2.466.143.284.27.578.37.882H23V1.575C23 .712 22.288 0 21.425 0H1.575C.712 0 0 .712 0 1.575v20.85C0 23.288.712 24 1.575 24h19.85c.863 0 1.575-.712 1.575-1.575V11.81c-.062-.113-.11-.237-.149-.362-.188-.6-.436-1.162-.734-1.684-.148-.26-.34-.473-.571-.629z" />
                </svg>
                Buy on WhatsApp
              </button>
              <button
                onClick={handleToggleWishlist}
                className={`w-full py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors border-2 ${
                  isLiked
                    ? 'bg-red-50 border-red-600 text-red-600 hover:bg-red-100'
                    : 'bg-white border-gray-300 text-gray-700 hover:border-red-600'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                {isLiked ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <button onClick={onClose} className="md:hidden absolute inset-0" aria-label="Close modal" />
    </div>
  );
}
