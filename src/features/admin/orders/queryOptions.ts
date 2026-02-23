import { queryOptions } from '@tanstack/react-query';
import { getOrders } from './api';
import type { OrderHistoryRequest } from './types';

/** Query key dạng primitive để tránh reference thay đổi mỗi render → gọi API trùng */
function ordersQueryKey(params: OrderHistoryRequest) {
  return [
    'orders',
    params.page,
    params.size,
    params.nameSearch ?? '',
    params.orderStatus ?? '',
  ] as const;
}

export const ordersQueryOptions = (params: OrderHistoryRequest) => {
  return queryOptions({
    queryKey: ordersQueryKey(params),
    queryFn: () => {
      console.log('Fetching orders...');
      return getOrders(params);
    },
    refetchOnWindowFocus: false,
    retry: false,
  });
};
