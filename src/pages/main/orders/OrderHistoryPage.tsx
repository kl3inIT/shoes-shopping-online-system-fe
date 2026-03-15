import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PageErrorState, PageLoader } from '@/components/app';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  OrderList,
  OrderTimeline,
  useOrderHistoryQuery,
  type OrderDateRangeOption,
} from '@/features/orders';
import { getErrorMessage } from '@/features/apiClient';

import { getOrderTimeline } from './data';

export function OrderHistoryPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [trackingDialogOpen, setTrackingDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const {
    orders,
    pagination,
    activeFilter,
    setActiveFilter,
    dateRange,
    setDateRange,
    customFrom,
    customTo,
    setCustomFrom,
    setCustomTo,
    setPage,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useOrderHistoryQuery(10);

  const selectedOrder = orders.find((order) => order.id === selectedOrderId);
  const timeline = selectedOrder
    ? getOrderTimeline(selectedOrder.status, (key) => t(key))
    : [];

  const handleViewDetails = (orderId: string) => {
    navigate(`/orders/${orderId}`);
  };

  const handleTrackOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setTrackingDialogOpen(true);
  };

  const handleReorder = () => {
    navigate('/cart');
  };

  const handleContinueShopping = () => {
    navigate('/products');
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-8'>
        <Button variant='ghost' className='mb-2' onClick={() => navigate(-1)}>
          <ArrowLeft className='mr-2 h-4 w-4' />
          {t('common.back')}
        </Button>
        <h1 className='text-3xl font-bold'>{t('orders.title')}</h1>
        <p className='text-muted-foreground'>{t('orders.subtitle')}</p>
      </div>

      <div className='mb-4 flex flex-wrap items-end gap-4'>
        <div className='space-y-1'>
          <p className='text-sm font-medium'>{t('orders.filters.dateRange')}</p>
          <Select
            value={dateRange}
            onValueChange={(value) =>
              setDateRange(value as OrderDateRangeOption)
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
          <div className='flex flex-wrap gap-4'>
            <div className='space-y-1'>
              <p className='text-xs text-muted-foreground'>
                {t('orders.filters.from')}
              </p>
              <div className='relative'>
                <CalendarIcon className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                <Input
                  type='date'
                  className='pl-9'
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
                  className='pl-9'
                  value={customTo ?? ''}
                  onChange={(e) =>
                    setCustomTo(e.target.value ? e.target.value : null)
                  }
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {isLoading ? (
        <PageLoader
          title={t('common.loading', 'Loading...')}
          description={t(
            'orders.loadingHistory',
            'Loading your order history.'
          )}
        />
      ) : error ? (
        <PageErrorState
          title={t('orders.errorTitle', 'Unable to load your orders')}
          description={getErrorMessage(error)}
          action={
            <Button variant='outline' onClick={() => void refetch()}>
              {t('common.retry', 'Retry')}
            </Button>
          }
        />
      ) : (
        <OrderList
          orders={orders}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          onViewDetails={handleViewDetails}
          onTrackOrder={handleTrackOrder}
          onReorder={handleReorder}
          onContinueShopping={handleContinueShopping}
        />
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className='mt-6 flex items-center justify-center gap-4'>
          <Button
            variant='outline'
            size='sm'
            disabled={pagination.first || isFetching}
            onClick={() => setPage(pagination.page - 1)}
          >
            <ChevronLeft className='h-4 w-4' />
            {t('common.previous', 'Previous')}
          </Button>
          <span className='text-sm text-muted-foreground'>
            {t('common.pageOf', 'Page {{current}} of {{total}}', {
              current: pagination.page + 1,
              total: pagination.totalPages,
            })}
          </span>
          <Button
            variant='outline'
            size='sm'
            disabled={pagination.last || isFetching}
            onClick={() => setPage(pagination.page + 1)}
          >
            {t('common.next', 'Next')}
            <ChevronRight className='h-4 w-4' />
          </Button>
        </div>
      )}

      <Dialog open={trackingDialogOpen} onOpenChange={setTrackingDialogOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>
              {t('orders.timeline.title', {
                number: selectedOrder?.orderNumber,
              })}
            </DialogTitle>
          </DialogHeader>
          <div className='py-4'>
            <OrderTimeline steps={timeline} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default OrderHistoryPage;
