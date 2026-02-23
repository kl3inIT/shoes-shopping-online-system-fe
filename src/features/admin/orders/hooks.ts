import { useQuery } from '@tanstack/react-query';
import type { OrderHistoryRequest } from './types';
import { ordersQueryOptions } from './queryOptions';

export function useQueryOrders(params: OrderHistoryRequest) {
  return useQuery(ordersQueryOptions(params));
}
