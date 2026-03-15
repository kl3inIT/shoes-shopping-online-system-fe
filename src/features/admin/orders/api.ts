import type { ApiSuccessResponse } from '@/types';
import type { OrderHistoryRequest, OrderPageResponse } from './types';
import apiClient from '@/features/apiClient';

export async function getOrders(
  params: OrderHistoryRequest
): Promise<OrderPageResponse> {
  const response = await apiClient.get<ApiSuccessResponse<OrderPageResponse>>(
    '/api/v1/admin/orders',
    { params }
  );
  return response.data.data;
}
