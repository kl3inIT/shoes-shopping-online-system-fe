import { queryOptions } from '@tanstack/react-query';
import { getPaymentInfo } from './api';

export const paymentInfoQueryKey = (orderId: string) =>
  ['order', orderId, 'payment-info'] as const;

export const paymentInfoQueryOptions = (orderId: string) =>
  queryOptions({
    queryKey: paymentInfoQueryKey(orderId),
    queryFn: () => getPaymentInfo(orderId),
    enabled: !!orderId,
    refetchOnWindowFocus: false,
  });
