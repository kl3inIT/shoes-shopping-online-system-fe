import type { PaymentOption } from '@/features/checkout';
import type { ShippingAddress } from '@/features/checkout';

export const paymentOptions: PaymentOption[] = [
  {
    id: 'online-qr',
    name: 'Online Payment via QR',
    description: 'Scan the QR code to complete your payment securely.',
    icon: 'wallet',
  },
];

export const initialAddress: ShippingAddress = {
  fullName: '',
  phone: '',
  address: '',
  city: '',
  district: '',
  ward: '',
  note: '',
};
