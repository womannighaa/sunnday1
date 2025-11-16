import { CartItem } from '../context/CartContext';

const WHATSAPP_NUMBER = '0740685488';

export function generateWhatsAppLink(
  productName: string,
  size?: string,
  color?: string
): string {
  let message = `Hi Eddjos Collections! I'm interested in the ${productName}`;

  if (size) {
    message += ` (size ${size})`;
  }

  if (color) {
    message += ` in ${color}`;
  }

  message += `. Please let me know the available sizes, colors, and pricing.`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}

export function generateWhatsAppCartCheckout(cartItems: CartItem[]): string {
  let message = '*Order Summary from Eddjos Collections*\n\n';
  let total = 0;

  message += '*Items:*\n';
  cartItems.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    message += `${index + 1}. ${item.productName}\n`;
    message += `   Qty: ${item.quantity} × KSh ${item.price.toLocaleString()}\n`;
    if (item.selectedSize) message += `   Size: ${item.selectedSize}\n`;
    if (item.selectedColor) message += `   Color: ${item.selectedColor}\n`;
    message += `   Subtotal: KSh ${itemTotal.toLocaleString()}\n\n`;
  });

  message += `*Total: KSh ${total.toLocaleString()}*\n\n`;
  message += 'Please confirm this order. Ready to proceed with payment?';

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}

export function getWhatsAppFloatingLink(): string {
  const message = encodeURIComponent(
    "Hi Eddjos Collections! I'd like to browse your products and place an order."
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
}
