import type { OrderFilterStatus } from './components/OrderList';
import type { OrderItem, OrderStatus } from './components/OrderCard';

/** Raw item from BE */
export interface CustomerOrderItemResponse {
  id: string;
  name: string;
  image: string;
  price: number;
  size: string;
  quantity: number;
}

/** Raw order from BE */
export interface CustomerOrderHistoryResponse {
  id: string;
  orderNumber: string;
  status: string;
  createdAt: string;
  items: CustomerOrderItemResponse[];
  total: number;
}

/** Spring Page shape (BE trả về trong data) */
export interface OrderHistoryPageResponse {
  content: CustomerOrderHistoryResponse[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

/** Kiểu filter khoảng thời gian */
export type OrderDateRangeOption =
  | 'all'
  | 'LAST_7_DAYS'
  | 'LAST_30_DAYS'
  | 'CUSTOM';

/** Query params cho GET /api/orders */
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

/** BE trả về đúng enum string; giữ nguyên, chỉ validate. */
export function mapBeStatusToFe(beStatus: string): OrderStatus {
  if (VALID_ORDER_STATUSES.includes(beStatus as OrderStatus)) {
    return beStatus as OrderStatus;
  }
  return 'PENDING_PAYMENT';
}

/** Map FE filter tab sang BE orderStatus. 'all' => undefined; còn lại là đúng enum. */
export function mapFeFilterToBeOrderStatus(
  filter: OrderFilterStatus
): string | undefined {
  return filter === 'all' ? undefined : filter;
}

/** Chuyển 1 đơn từ BE sang dạng OrderCard (id/createdAt string, items với id string, status FE). */
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
      name: item.name,
      image: item.image ?? '',
      price: Number(item.price),
      size: item.size ?? '',
      quantity: Number(item.quantity),
    })),
    total: Number(order.total),
  };
}
