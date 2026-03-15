import type { OrderFilterStatus } from './components/OrderList';
import type { OrderItem, OrderStatus } from './components/OrderCard';

export type CustomerOrderSummary = {
  createdAt: string;
  id: string;
  orderNumber: string;
  paymentStatus: string;
  shippingStatus?: string;
  totalAmount: number;
};

export type CustomerOrdersQueryParams = {
  page?: number;
  size?: number;
  status?: string;
};

export interface CustomerOrderItemResponse {
  id: string;
  shoeId: string | null;
  shoeVariantId: string | null;
  name: string;
  image: string;
  price: number;
  size: string;
  quantity: number;
}

export interface CustomerOrderHistoryResponse {
  id: string;
  orderNumber: string;
  status: string;
  createdAt: string;
  items: CustomerOrderItemResponse[];
  total: number;
}

export interface OrderHistoryPageResponse {
  content: CustomerOrderHistoryResponse[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export type OrderDateRangeOption =
  | 'all'
  | 'LAST_7_DAYS'
  | 'LAST_30_DAYS'
  | 'CUSTOM';

export interface OrderHistoryParams {
  page: number;
  size: number;
  orderStatus?: string;
  dateFrom?: string;
  dateTo?: string;
}

const VALID_ORDER_STATUSES: OrderStatus[] = [
  'PENDING_PAYMENT',
  'PAYMENT_EXPIRED',
  'PAID',
  'CONFIRMED',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
  'REFUNDED',
];

export function mapBeStatusToFe(beStatus: string): OrderStatus {
  if (VALID_ORDER_STATUSES.includes(beStatus as OrderStatus)) {
    return beStatus as OrderStatus;
  }
  return 'PENDING_PAYMENT';
}

export function mapFeFilterToBeOrderStatus(
  filter: OrderFilterStatus
): string | undefined {
  return filter === 'all' ? undefined : filter;
}

export function mapOrderToCardData(order: CustomerOrderHistoryResponse): {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  createdAt: string;
  items: OrderItem[];
  total: number;
} {
  return {
    id: String(order.id),
    orderNumber: order.orderNumber,
    status: mapBeStatusToFe(order.status),
    createdAt: order.createdAt,
    items: (order.items ?? []).map((item) => ({
      id: String(item.id),
      shoeId: item.shoeId ?? null,
      shoeVariantId: item.shoeVariantId ?? null,
      name: item.name,
      image: item.image ?? '',
      price: Number(item.price),
      size: item.size ?? '',
      quantity: Number(item.quantity),
    })),
    total: Number(order.total),
  };
}
