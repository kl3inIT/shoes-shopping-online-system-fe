import apiClient from '@/features/apiClient';
import type { ApiSuccessResponse } from '@/types';
import type { CreateOrderRequest, OrderCreateResponse } from './types';

export async function createOrder(
  body: CreateOrderRequest
): Promise<OrderCreateResponse> {
  const response = await apiClient.post<
    ApiSuccessResponse<OrderCreateResponse>
  >('/api/orders/init', body);

  return response.data.data;
}
