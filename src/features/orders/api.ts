import apiClient from '@/features/apiClient';
import type { ApiSuccessResponse } from '@/types';

import type {
  CustomerOrderHistoryResponse,
  CustomerOrdersQueryParams,
  CustomerOrderSummary,
  OrderHistoryPageResponse,
  OrderHistoryParams,
} from './types';

const ORDERS_BASE = '/api/v1/orders';

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

export async function getOrderDetail(
  orderId: string
): Promise<CustomerOrderHistoryResponse> {
  const response = await apiClient.get<
    ApiSuccessResponse<CustomerOrderHistoryResponse>
  >(`${ORDERS_BASE}/${orderId}`);

  return response.data.data;
}

export async function getMyOrders(
  _params?: CustomerOrdersQueryParams
): Promise<CustomerOrderSummary[]> {
  const response = await apiClient.get<
    ApiSuccessResponse<OrderHistoryPageResponse>
  >(ORDERS_BASE, {
    params: {
      page: _params?.page ?? 0,
      size: _params?.size ?? 10,
      ...(_params?.status ? { orderStatus: _params.status } : {}),
    },
  });

  return (response.data.data.content ?? []).map((order) => ({
    createdAt: order.createdAt,
    id: order.id,
    orderNumber: order.orderNumber,
    paymentStatus: order.status,
    totalAmount: order.total,
  }));
}
