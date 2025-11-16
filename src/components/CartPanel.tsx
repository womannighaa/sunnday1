import { X, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { generateWhatsAppCartCheckout } from '../lib/whatsapp';

interface CartPanelProps {
  onClose: () => void;
}

export default function CartPanel({ onClose }: CartPanelProps) {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const totalPrice = getTotalPrice();

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    const whatsappLink = generateWhatsAppCartCheckout(cartItems);
    window.open(whatsappLink, '_blank');
    clearCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="bg-white w-full max-w-md h-full max-h-screen flex flex-col rounded-t-2xl md:rounded-l-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold">Shopping Cart</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-gray-500 text-lg">Your cart is empty</p>
              <p className="text-gray-400 text-sm mt-2">Add items to get started</p>
            </div>
          ) : (
            cartItems.map((item, index) => (
              <div
                key={`${item.productId}-${item.selectedSize}-${item.selectedColor}-${index}`}
                className="flex gap-3 pb-4 border-b border-gray-100"
              >
                {item.image_url && (
                  <img
                    src={item.image_url}
                    alt={item.productName}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-medium line-clamp-2">{item.productName}</h3>
                  {item.selectedSize && <p className="text-sm text-gray-500">Size: {item.selectedSize}</p>}
                  {item.selectedColor && <p className="text-sm text-gray-500">Color: {item.selectedColor}</p>}
                  <p className="text-sm font-semibold mt-1">
                    KSh {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1 bg-gray-100 rounded px-2 py-1">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1, item.selectedSize, item.selectedColor)}
                      className="text-sm font-bold hover:text-gray-700"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1, item.selectedSize, item.selectedColor)}
                      className="text-sm font-bold hover:text-gray-700"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.productId, item.selectedSize, item.selectedColor)}
                    className="p-1 hover:bg-red-50 rounded text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="border-t border-gray-100 p-6 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>KSh {totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>KSh {totalPrice.toLocaleString()}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-5.031 1.378c-2.872 1.695-4.7 5.189-4.7 8.812 0 2.52.738 4.063 2.202 5.204.666.538 1.203.812 1.860.812.5 0 1.038-.194 1.57-.437 1.011-.44 1.966-1.059 2.686-1.543.321-.198.65-.38.926-.436.284-.057.635.053.835.353.55.852 1.007 1.772 1.348 2.466.143.284.27.578.37.882H23V1.575C23 .712 22.288 0 21.425 0H1.575C.712 0 0 .712 0 1.575v20.85C0 23.288.712 24 1.575 24h19.85c.863 0 1.575-.712 1.575-1.575V11.81c-.062-.113-.11-.237-.149-.362-.188-.6-.436-1.162-.734-1.684-.148-.26-.34-.473-.571-.629z" />
              </svg>
              Checkout via WhatsApp
            </button>
            <button
              onClick={() => clearCart()}
              className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-lg transition-colors"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
      <button
        onClick={onClose}
        className="md:hidden absolute inset-0"
        aria-label="Close cart"
      />
    </div>
  );
}
