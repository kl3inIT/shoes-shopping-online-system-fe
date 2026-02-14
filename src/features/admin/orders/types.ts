// Match backend enums: PaymentStatus, PaymentMethod, OrderStatus
export type PaymentStatus =
  | 'PENDING'
  | 'TIME_OUT'
  | 'PAID'
  | 'FAILED'
  | 'REFUNDED';

export type PaymentMethod = 'ONLINE' | 'COD';

export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'PAYMENT_EXPIRED'
  | 'PAID'
  | 'CONFIRMED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

// Order response DTO from backend
export interface OrderResponse {
  orderId: string;
  orderCode: string;
  orderDate: string;
  customerName: string;
  customerEmail: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  itemCount: number;
  totalAmount: number;
}

// Request DTO to fetch order history (Admin)
export interface OrderHistoryRequest {
  page: number;
  size: number;
  nameSearch?: string; // search theo shippingName hoặc customer name
  dateFrom?: string; // ISO-8601 Instant
  dateTo?: string; // ISO-8601 Instant
  orderStatus?: OrderStatus;
}
