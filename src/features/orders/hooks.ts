import { useQuery } from '@tanstack/react-query';

import { getMyOrders } from './api';
import type { CustomerOrdersQueryParams } from './types';

export function useMyOrders(_params?: CustomerOrdersQueryParams) {
  return useQuery({
    queryKey: ['orders', 'me', _params ?? {}],
    queryFn: () => getMyOrders(_params),
    enabled: false,
  });
}
