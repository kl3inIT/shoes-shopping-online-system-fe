import type { ApiSuccessResponse } from '@/types';
import type { OrderHistoryRequest, OrderResponse } from './types';
import apiClient from '@/features/apiClient';

export async function getOrders(
  params: OrderHistoryRequest
): Promise<OrderResponse[]> {
  const response = await apiClient.get<ApiSuccessResponse<OrderResponse[]>>(
    '/api/orders/admin',
    { params, skipAuth: true }
  );
  return response.data.data;
}
