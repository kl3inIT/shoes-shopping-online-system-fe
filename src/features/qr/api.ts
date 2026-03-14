import apiClient from '@/features/apiClient';
import type { ApiSuccessResponse } from '@/types';
import type { PaymentInfoResponse } from './types';

export async function getPaymentInfo(
  orderId: string
): Promise<PaymentInfoResponse> {
  const response = await apiClient.get<ApiSuccessResponse<PaymentInfoResponse>>(
    `/api/orders/payment-info/${orderId}`
  );

  return response.data.data;
}
