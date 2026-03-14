import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import type { OrderFilterStatus } from './components/OrderList';
import { getOrderDetail, getOrderHistory } from './api';
import {
  mapFeFilterToBeOrderStatus,
  mapOrderToCardData,
  type OrderDateRangeOption,
  type OrderHistoryParams,
} from './types';

const DEFAULT_PAGE_SIZE = 10;

function startOfDaysAgo(days: number): string {
  const now = new Date();
  const from = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  return from.toISOString();
}

function nowIso(): string {
  return new Date().toISOString();
}

export const orderHistoryQueryKey = {
  all: ['orders', 'history'] as const,
  list: (params: OrderHistoryParams) =>
    [...orderHistoryQueryKey.all, params] as const,
};

export const orderDetailQueryKey = {
  all: ['orders', 'detail'] as const,
  detail: (orderId: string) => [...orderDetailQueryKey.all, orderId] as const,
};

export function useOrderHistoryQuery(pageSize = DEFAULT_PAGE_SIZE) {
  const [page, setPage] = useState(0);
  const [activeFilter, setActiveFilter] = useState<OrderFilterStatus>('all');
  const [dateRange, setDateRange] =
    useState<OrderDateRangeOption>('LAST_7_DAYS');
  const [customFrom, setCustomFrom] = useState<string | null>(null);
  const [customTo, setCustomTo] = useState<string | null>(null);

  const computedDates = useMemo(() => {
    if (dateRange === 'LAST_7_DAYS') {
      return { dateFrom: startOfDaysAgo(7), dateTo: nowIso() };
    }
    if (dateRange === 'LAST_30_DAYS') {
      return { dateFrom: startOfDaysAgo(30), dateTo: nowIso() };
    }
    if (dateRange === 'CUSTOM') {
      if (!customFrom && !customTo) {
        return { dateFrom: undefined, dateTo: undefined };
      }
      const fromIso = customFrom
        ? new Date(`${customFrom}T00:00:00Z`).toISOString()
        : undefined;
      const toIso = customTo
        ? new Date(`${customTo}T23:59:59Z`).toISOString()
        : undefined;
      return { dateFrom: fromIso, dateTo: toIso };
    }
    return { dateFrom: undefined, dateTo: undefined };
  }, [dateRange, customFrom, customTo]);

  const params: OrderHistoryParams = useMemo(
    () => ({
      page,
      size: pageSize,
      orderStatus: mapFeFilterToBeOrderStatus(activeFilter),
      dateFrom: computedDates.dateFrom,
      dateTo: computedDates.dateTo,
    }),
    [page, pageSize, activeFilter, computedDates]
  );

  const query = useQuery({
    queryKey: orderHistoryQueryKey.list(params),
    queryFn: () => getOrderHistory(params),
  });

  const orders = useMemo(
    () => (query.data?.content ?? []).map(mapOrderToCardData),
    [query.data]
  );

  const pagination = useMemo(
    () =>
      query.data
        ? {
            page: query.data.number,
            size: query.data.size,
            totalElements: query.data.totalElements,
            totalPages: query.data.totalPages,
            first: query.data.first,
            last: query.data.last,
          }
        : null,
    [query.data]
  );

  const setPageSafe = (nextPage: number) => {
    setPage(Math.max(0, nextPage));
  };

  const handleFilterChange = (filter: OrderFilterStatus) => {
    setActiveFilter(filter);
    setPage(0);
  };

  return {
    orders,
    pagination,
    activeFilter,
    setActiveFilter: handleFilterChange,
    dateRange,
    setDateRange,
    customFrom,
    customTo,
    setCustomFrom,
    setCustomTo,
    setPage: setPageSafe,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useOrderDetailQuery(orderId: string | undefined) {
  const query = useQuery({
    queryKey: orderId
      ? orderDetailQueryKey.detail(orderId)
      : ['orders', 'detail', 'unknown'],
    queryFn: () => {
      if (!orderId) {
        throw new Error('Order ID is required');
      }
      return getOrderDetail(orderId);
    },
    enabled: !!orderId,
  });

  const order = useMemo(
    () => (query.data ? mapOrderToCardData(query.data) : null),
    [query.data]
  );

  return {
    order,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  };
}
