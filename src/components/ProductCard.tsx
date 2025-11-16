import { Product } from '../lib/supabase';
import { generateWhatsAppLink } from '../lib/whatsapp';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const handleCardClick = () => {
    if (!product.in_stock) return;

    const whatsappLink = generateWhatsAppLink(product.name);
    window.open(whatsappLink, '_blank');
  };

  const displayPrice = product.discounted_price || product.price;
  const originalPrice = product.original_price;
  const showDiscount = originalPrice && originalPrice > displayPrice;

  return (
    <div
      onClick={handleCardClick}
      className={`relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 ${
        product.in_stock ? 'cursor-pointer' : 'opacity-60'
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
      </div>

      <div className="p-4 space-y-2">
        <h3 className="font-medium text-lg text-gray-900 line-clamp-2">
          {product.name}
        </h3>

        <div className="flex items-baseline gap-2">
          {showDiscount ? (
            <>
              <span className="text-sm text-gray-400 line-through">
                KSh {originalPrice.toLocaleString()}
              </span>
              <span className="text-xl font-bold text-gray-900">
                KSh {displayPrice.toLocaleString()}
              </span>
            </>
          ) : (
            <span className="text-xl font-bold text-gray-900">
              KSh {displayPrice.toLocaleString()}
            </span>
          )}
        </div>

        {!product.in_stock && (
          <p className="text-sm text-red-600 font-medium">Out of Stock</p>
        )}
      </div>
    </div>
  );
}
