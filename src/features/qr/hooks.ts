import { useQuery } from '@tanstack/react-query';
import { paymentInfoQueryOptions } from './queryOptions';

export function usePaymentInfoQuery(orderId: string | undefined) {
  return useQuery(paymentInfoQueryOptions(orderId ?? ''));
}
