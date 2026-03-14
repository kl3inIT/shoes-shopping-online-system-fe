import apiClient from '@/features/apiClient';
import type { ApiSuccessResponse } from '@/types';
import type {
  CustomerOrderHistoryResponse,
  OrderHistoryPageResponse,
  OrderHistoryParams,
} from './types';

const ORDERS_BASE = '/api/orders';

/**
 * Lấy danh sách đơn hàng theo customer (có phân trang, filter theo status).
 */
export async function getOrderHistory(
  params: OrderHistoryParams
): Promise<OrderHistoryPageResponse> {
  const searchParams = new URLSearchParams();
  searchParams.set('page', String(params.page));
  searchParams.set('size', String(params.size));
  if (params.orderStatus != null && params.orderStatus !== '') {
    searchParams.set('orderStatus', params.orderStatus);
  }
  if (params.dateFrom) {
    searchParams.set('dateFrom', params.dateFrom);
  }
  if (params.dateTo) {
    searchParams.set('dateTo', params.dateTo);
  }

  const response = await apiClient.get<
    ApiSuccessResponse<OrderHistoryPageResponse>
  >(`${ORDERS_BASE}?${searchParams.toString()}`);

  return response.data.data;
}

/**
 * Lấy chi tiết 1 đơn hàng theo ID cho customer hiện tại.
 */
export async function getOrderDetail(
  orderId: string
): Promise<CustomerOrderHistoryResponse> {
  const response = await apiClient.get<
    ApiSuccessResponse<CustomerOrderHistoryResponse>
  >(`${ORDERS_BASE}/${orderId}`);

  return response.data.data;
}
