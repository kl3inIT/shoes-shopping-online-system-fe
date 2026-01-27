import type { CheckoutItem } from '@/features/checkout';
import type { PaymentOption } from '@/features/checkout';
import type { ShippingAddress } from '@/features/checkout';

export const mockCheckoutItems: CheckoutItem[] = [
  {
    id: 'cart-1',
    name: 'Nike Air Max 270',
    brand: 'Nike',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    price: 150,
    size: '42',
    quantity: 1,
  },
  {
    id: 'cart-2',
    name: 'Adidas Ultraboost 22',
    brand: 'Adidas',
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400',
    price: 190,
    size: '43',
    quantity: 2,
  },
];

export const paymentOptions: PaymentOption[] = [
  {
    id: 'se-pay',
    name: 'SE Pay',
    description: 'Pay securely with SE Pay wallet',
    icon: 'wallet',
  },
  {
    id: 'credit-card',
    name: 'Credit/Debit Card',
    description: 'Visa, MasterCard, American Express',
    icon: 'card',
  },
  {
    id: 'cod',
    name: 'Cash on Delivery',
    description: 'Pay when you receive your order',
    icon: 'cash',
  },
];

export const cities = [
  { value: 'hcm', label: 'Ho Chi Minh City' },
  { value: 'hn', label: 'Hanoi' },
  { value: 'dn', label: 'Da Nang' },
  { value: 'hp', label: 'Hai Phong' },
  { value: 'ct', label: 'Can Tho' },
];

export const districts: Record<string, { value: string; label: string }[]> = {
  hcm: [
    { value: 'd1', label: 'District 1' },
    { value: 'd2', label: 'District 2' },
    { value: 'd3', label: 'District 3' },
    { value: 'd7', label: 'District 7' },
    { value: 'btan', label: 'Binh Tan' },
    { value: 'td', label: 'Thu Duc' },
  ],
  hn: [
    { value: 'hk', label: 'Hoan Kiem' },
    { value: 'bd', label: 'Ba Dinh' },
    { value: 'tx', label: 'Thanh Xuan' },
    { value: 'cg', label: 'Cau Giay' },
  ],
};

export const wards: Record<string, { value: string; label: string }[]> = {
  d1: [
    { value: 'bn', label: 'Ben Nghe' },
    { value: 'bt', label: 'Ben Thanh' },
    { value: 'pk', label: 'Pham Ngu Lao' },
  ],
  d7: [
    { value: 'tn', label: 'Tan Phong' },
    { value: 'tp', label: 'Tan Phu' },
    { value: 'pk', label: 'Phu My' },
  ],
};

export const initialAddress: ShippingAddress = {
  fullName: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  district: '',
  ward: '',
  note: '',
};

export const calculateOrderSummary = (items: CheckoutItem[]) => {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal >= 100 ? 0 : 10;
  const discount = 0;
  const tax = (subtotal - discount) * 0.1;
  const total = subtotal + shipping - discount + tax;

  return { subtotal, shipping, discount, tax, total };
};
