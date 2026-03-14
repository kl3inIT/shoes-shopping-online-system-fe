import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useOrderDetailQuery, type OrderStatus } from '@/features/orders';
import { getOrderTimeline } from './data';
import { OrderTimeline } from '@/features/orders';

function getStatusTranslationKey(status: OrderStatus): string {
  switch (status) {
    case 'CONFIRMED':
      return 'orders.filter.confirmed';
    case 'DELIVERED':
      return 'orders.filter.delivered';
    case 'CANCELLED':
      return 'orders.filter.cancelled';
    case 'SHIPPED':
      return 'orders.filter.shipped';
    case 'PAID':
      return 'orders.filter.processing';
    case 'PENDING_PAYMENT':
      return 'orders.filter.pending';
    case 'PAYMENT_EXPIRED':
      return 'orders.filter.cancelled';
    case 'REFUNDED':
      return 'orders.filter.cancelled';
    default:
      return 'orders.filter.pending';
  }
}

export function OrderDetailPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();

  const { order, isLoading, isFetching, error } = useOrderDetailQuery(orderId);

  const timeline = useMemo(
    () => (order ? getOrderTimeline(order.status, (key) => t(key)) : []),
    [order, t]
  );

  const isLoadingState = isLoading || isFetching;

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-6 flex items-center justify-between'>
        <Button variant='ghost' onClick={() => navigate(-1)}>
          <ArrowLeft className='mr-2 h-4 w-4' />
          {t('common.back')}
        </Button>
      </div>

      {isLoadingState && (
        <p className='text-sm text-muted-foreground'>
          {t('common.loading', 'Loading...')}
        </p>
      )}

      {error && !isLoadingState && (
        <p className='mb-4 text-sm text-destructive'>
          {error instanceof Error
            ? error.message
            : t('http.error.unknown', 'Something went wrong')}
        </p>
      )}

      {!isLoadingState && !error && !order && (
        <p className='text-sm text-muted-foreground'>
          {t('orders.detail.notFound', 'Order not found')}
        </p>
      )}

      {order && (
        <div className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle className='flex flex-wrap items-center justify-between gap-2'>
                <span>
                  {t('orders.orderNumber', { number: order.orderNumber })}
                </span>
                <span className='text-sm font-medium text-muted-foreground'>
                  {t('orders.statusLabel', 'Status')}:{' '}
                  {t(getStatusTranslationKey(order.status))}
                </span>
              </CardTitle>
              <p className='text-sm text-muted-foreground'>
                {t('orders.placedOn', {
                  date: new Date(order.createdAt).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }),
                })}
              </p>
            </CardHeader>

            <CardContent className='space-y-4'>
              <div>
                <h3 className='mb-2 text-sm font-semibold'>
                  {t('orders.items', 'Order items')}
                </h3>
                <div className='space-y-3'>
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className='flex items-center gap-3 rounded-md border p-3'
                    >
                      <div className='h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted'>
                        <img
                          src={item.image}
                          alt={item.name}
                          className='h-full w-full object-cover'
                        />
                      </div>
                      <div className='flex-1'>
                        <p className='font-medium'>{item.name}</p>
                        <p className='text-xs text-muted-foreground'>
                          {t('cart.item.size')}: {item.size} × {item.quantity}
                        </p>
                      </div>
                      <div className='text-right text-sm font-semibold'>
                        {(item.price * item.quantity).toLocaleString('vi-VN')} ₫
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>
                  {t('orders.total', 'Total')}
                </span>
                <span className='text-lg font-bold'>
                  {order.total.toLocaleString('vi-VN')} ₫
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {t('orders.timeline.title', {
                  number: order.orderNumber,
                })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <OrderTimeline steps={timeline} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default OrderDetailPage;
