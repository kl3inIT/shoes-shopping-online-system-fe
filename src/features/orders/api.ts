import apiClient from '@/features/apiClient';

import type { CustomerOrderSummary, CustomerOrdersQueryParams } from './types';

export async function getMyOrders(
  _params?: CustomerOrdersQueryParams
): Promise<CustomerOrderSummary[]> {
  // TODO: Confirm customer order-history endpoint contract before enabling this query.
  const response = await apiClient.get<CustomerOrderSummary[]>(
    '/api/orders/my-orders'
  );
  return response.data;
}
