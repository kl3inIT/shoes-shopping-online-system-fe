import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { IconSearch } from '@tabler/icons-react';
import { Calendar as CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useQueryOrders } from '@/features/admin/orders';
import type { OrderResponse, OrderStatus } from '@/features/admin/orders';
import {
  OrderTable,
  OrderStatsCards,
  OrderDetailDialog,
} from '@/features/admin/orders/components';

import { statusOptions } from './data';

const DEFAULT_PAGE = 0;
const DEFAULT_SIZE = 10;
const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

type AdminDateRangeOption = 'all' | 'LAST_7_DAYS' | 'LAST_30_DAYS' | 'CUSTOM';

function startOfDaysAgo(days: number): string {
  const from = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return from.toISOString();
}

function nowIso(): string {
  return new Date().toISOString();
}

export default function AdminOrdersPage() {
  const { t } = useTranslation();
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [dateRange, setDateRange] =
    useState<AdminDateRangeOption>('LAST_7_DAYS');
  const [customFrom, setCustomFrom] = useState<string | null>(null);
  const [customTo, setCustomTo] = useState<string | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(
    null
  );

  const computedDates = useMemo(() => {
    if (dateRange === 'LAST_7_DAYS') {
      return { dateFrom: startOfDaysAgo(7), dateTo: nowIso() };
    }
    if (dateRange === 'LAST_30_DAYS') {
      return { dateFrom: startOfDaysAgo(30), dateTo: nowIso() };
    }
    if (dateRange === 'CUSTOM') {
      const fromIso = customFrom
        ? new Date(`${customFrom}T00:00:00.000Z`).toISOString()
        : undefined;
      const toIso = customTo
        ? new Date(`${customTo}T23:59:59.999Z`).toISOString()
        : undefined;
      return { dateFrom: fromIso, dateTo: toIso };
    }
    return { dateFrom: undefined, dateTo: undefined };
  }, [dateRange, customFrom, customTo]);

  const [params, setParams] = useState({
    page: DEFAULT_PAGE,
    size: DEFAULT_SIZE,
    nameSearch: '' as string | undefined,
    orderStatus: undefined as OrderStatus | undefined,
  });

  const requestParams = useMemo(
    () => ({
      ...params,
      dateFrom: computedDates.dateFrom,
      dateTo: computedDates.dateTo,
    }),
    [params, computedDates]
  );

  const { data, isPending } = useQueryOrders(requestParams);
  const orders = data?.content ?? [];
  const totalElements = data?.totalElements ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const stats = useMemo(() => {
    return {
      processing: orders.filter((o) => o.orderStatus === 'CONFIRMED').length,
      shipped: orders.filter((o) => o.orderStatus === 'SHIPPED').length,
      revenue: orders
        .filter((o) => o.paymentStatus === 'PAID')
        .reduce((sum, o) => sum + o.totalAmount, 0),
    };
  }, [orders]);

  const handleSearch = () => {
    setParams((prev) => ({
      ...prev,
      page: DEFAULT_PAGE,
      nameSearch: searchInput.trim() || undefined,
      orderStatus:
        statusFilter === 'all' ? undefined : (statusFilter as OrderStatus),
    }));
  };

  const handleDateRangeChange = (value: AdminDateRangeOption) => {
    setDateRange(value);
    setParams((prev) => ({ ...prev, page: DEFAULT_PAGE }));
  };

  const handleViewDetails = (order: OrderResponse) => {
    setSelectedOrder(order);
    setDetailDialogOpen(true);
  };

  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (size: number) => {
    setParams((prev) => ({ ...prev, size, page: 0 }));
  };

  return (
    <div className='flex flex-col gap-4 py-4'>
      <div className='flex items-center justify-between px-4 lg:px-6'>
        <div>
          <h1 className='text-2xl font-bold'>{t('admin.orders.title')}</h1>
          <p className='text-muted-foreground'>
            {t('admin.orders.subtitle', { count: totalElements })}
          </p>
        </div>
      </div>

      <div className='px-4 lg:px-6'>
        <OrderStatsCards {...stats} />
      </div>

      <div className='flex flex-wrap items-end gap-4 px-4 lg:px-6'>
        <div className='space-y-1'>
          <p className='text-sm font-medium'>{t('orders.filters.dateRange')}</p>
          <Select
            value={dateRange}
            onValueChange={(v) =>
              handleDateRangeChange(v as AdminDateRangeOption)
            }
          >
            <SelectTrigger className='w-[200px]'>
              <SelectValue
                placeholder={t('orders.filters.dateRangePlaceholder')}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>
                {t('orders.filters.range.all')}
              </SelectItem>
              <SelectItem value='LAST_7_DAYS'>
                {t('orders.filters.range.7days')}
              </SelectItem>
              <SelectItem value='LAST_30_DAYS'>
                {t('orders.filters.range.30days')}
              </SelectItem>
              <SelectItem value='CUSTOM'>
                {t('orders.filters.range.custom')}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {dateRange === 'CUSTOM' && (
          <>
            <div className='space-y-1'>
              <p className='text-xs text-muted-foreground'>
                {t('orders.filters.from')}
              </p>
              <div className='relative'>
                <CalendarIcon className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                <Input
                  type='date'
                  className='w-[180px] pl-9'
                  value={customFrom ?? ''}
                  onChange={(e) =>
                    setCustomFrom(e.target.value ? e.target.value : null)
                  }
                />
              </div>
            </div>
            <div className='space-y-1'>
              <p className='text-xs text-muted-foreground'>
                {t('orders.filters.to')}
              </p>
              <div className='relative'>
                <CalendarIcon className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                <Input
                  type='date'
                  className='w-[180px] pl-9'
                  value={customTo ?? ''}
                  onChange={(e) =>
                    setCustomTo(e.target.value ? e.target.value : null)
                  }
                />
              </div>
            </div>
          </>
        )}

        <div className='relative flex-1 min-w-[200px]'>
          <IconSearch className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
          <Input
            placeholder={t('admin.orders.searchPlaceholder')}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className='pl-10'
          />
        </div>
        <Select
          value={statusFilter ?? undefined}
          onValueChange={setStatusFilter}
        >
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder={t('admin.orders.filterStatus')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>{t('admin.orders.allStatuses')}</SelectItem>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleSearch}>
          <IconSearch className='mr-2 h-4 w-4' />
          {t('admin.orders.search', 'Search')}
        </Button>
      </div>

      <div className='px-4 lg:px-6'>
        {isPending ? (
          <p className='text-muted-foreground'>
            {t('common.loading', 'Loading...')}
          </p>
        ) : (
          <OrderTable
            orders={orders}
            onViewDetails={handleViewDetails}
            pagination={{
              page: params.page,
              totalPages,
              onPageChange: handlePageChange,
              pageSize: params.size,
              pageSizeOptions: PAGE_SIZE_OPTIONS,
              onPageSizeChange: handlePageSizeChange,
            }}
          />
        )}
      </div>

      <OrderDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        order={selectedOrder}
      />
    </div>
  );
}
