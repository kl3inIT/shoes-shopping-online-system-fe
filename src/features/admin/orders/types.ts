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

/** Spring Page response – bọc danh sách đơn + metadata phân trang */
export interface OrderPageResponse {
  content: OrderResponse[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: {
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    sort: { empty: boolean; sorted: boolean; unsorted: boolean };
    unpaged: boolean;
  };
  size: number;
  sort: { empty: boolean; sorted: boolean; unsorted: boolean };
  totalElements: number;
  totalPages: number;
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

/** Props phân trang truyền vào OrderTable */
export interface OrdersPagination {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Số bản ghi mỗi trang */
  pageSize: number;
  /** Các lựa chọn page size (mặc định [5, 10, 20, 50]) */
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
}

/** Props của OrderTable */
export interface OrderTableProps {
  orders: OrderResponse[];
  onViewDetails?: (order: OrderResponse) => void;
  pagination?: OrdersPagination;
}
