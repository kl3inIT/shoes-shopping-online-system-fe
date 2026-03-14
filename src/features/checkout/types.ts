export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  note?: string;
}

export interface CheckoutItem {
  id: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  size: string;
  quantity: number;
  color: string;
}

export interface CheckoutSummary {
  subtotal: number;
  shipping: number;
  discount: number;
  tax: number;
  total: number;
}

export interface PaymentOption {
  id: string;
  name: string;
  description?: string;
  icon?: 'card' | 'wallet' | 'cash';
  disabled?: boolean;
}

export interface CreateOrderRequest {
  discountId: number;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  notes: string;
}

export interface OrderCreateResponse {
  orderId: string;
  orderCode: string;
  bankNumber: string;
  bankCode: string;
  accountHolder: string;
  amount: number;
  status: string;
  expiredAt: string;
}
