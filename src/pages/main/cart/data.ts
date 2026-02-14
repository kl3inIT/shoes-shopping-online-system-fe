import type { CartItemProps } from '@/features/cart';

export const mockCartItems: Omit<
  CartItemProps,
  'onQuantityChange' | 'onRemove' | 'onClick'
>[] = [
  {
    id: 'cart-1',
    productId: '1',
    name: 'Nike Air Max 270',
    brand: 'Nike',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    price: 150,
    size: '42',
    quantity: 1,
  },
  {
    id: 'cart-2',
    productId: '2',
    name: 'Adidas Ultraboost 22',
    brand: 'Adidas',
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400',
    price: 190,
    size: '43',
    quantity: 2,
  },
  {
    id: 'cart-3',
    productId: '5',
    name: 'Converse Chuck Taylor',
    brand: 'Converse',
    image: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=400',
    price: 65,
    size: '41',
    quantity: 1,
  },
];

export const calculateCartSummary = (
  items: typeof mockCartItems,
  discountPercent = 0
) => {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal >= 100 ? 0 : 10;
  const discount = (subtotal * discountPercent) / 100;
  const tax = (subtotal - discount) * 0.1; // 10% tax
  const total = subtotal + shipping - discount + tax;

  return {
    subtotal,
    shipping,
    discount,
    tax,
    total,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
  };
};
