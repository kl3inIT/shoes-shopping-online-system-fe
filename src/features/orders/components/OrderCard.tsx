import { ChevronRight, Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'PAYMENT_EXPIRED'
  | 'PAID'
  | 'CONFIRMED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
  size: string;
  quantity: number;
}

export interface OrderCardProps {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  createdAt: string;
  items: OrderItem[];
  total: number;
  onViewDetails?: (orderId: string) => void;
  onTrackOrder?: (orderId: string) => void;
  onReorder?: (orderId: string) => void;
}

const statusConfig: Record<
  OrderStatus,
  {
    label: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
  }
> = {
  PENDING_PAYMENT: { label: 'Pending Payment', variant: 'secondary' },
  PAYMENT_EXPIRED: { label: 'Payment Expired', variant: 'destructive' },
  PAID: { label: 'Paid', variant: 'default' },
  CONFIRMED: { label: 'Confirmed', variant: 'default' },
  SHIPPED: { label: 'Shipped', variant: 'default' },
  DELIVERED: { label: 'Delivered', variant: 'outline' },
  CANCELLED: { label: 'Cancelled', variant: 'destructive' },
  REFUNDED: { label: 'Refunded', variant: 'destructive' },
};

export function OrderCard({
  id,
  orderNumber,
  status,
  createdAt,
  items,
  total,
  onViewDetails,
  onTrackOrder,
  onReorder,
}: OrderCardProps) {
  const { t } = useTranslation();
  const statusInfo = statusConfig[status] ?? statusConfig.PENDING_PAYMENT;
  const locale =
    t('appName') && typeof navigator !== 'undefined'
      ? navigator.language
      : 'en-US';
  const displayItems = items.slice(0, 2);
  const remainingCount = items.length - 2;

  return (
    <Card>
      <CardHeader className='pb-3'>
        <div className='flex flex-wrap items-center justify-between gap-2'>
          <div className='flex items-center gap-2'>
            <Package className='h-4 w-4 text-muted-foreground' />
            <span className='font-medium'>
              {t('orders.orderNumber', { number: orderNumber })}
            </span>
          </div>
          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
        </div>
        <p className='text-sm text-muted-foreground'>
          {t('orders.placedOn', {
            date: new Date(createdAt).toLocaleDateString(locale, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
          })}
        </p>
      </CardHeader>
      <Separator />
      <CardContent className='pt-4'>
        <div className='space-y-3'>
          {displayItems.map((item) => (
            <div key={item.id} className='flex gap-3'>
              <div className='h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted'>
                <img
                  src={item.image}
                  alt={item.name}
                  className='h-full w-full object-cover'
                />
              </div>
              <div className='flex-1'>
                <p className='line-clamp-1 font-medium'>{item.name}</p>
                <p className='text-sm text-muted-foreground'>
                  {t('cart.item.size')}: {item.size} x {item.quantity}
                </p>
                <p className='text-sm font-medium'>
                  {(item.price * item.quantity).toLocaleString('vi-VN')} VND
                </p>
              </div>
            </div>
          ))}
          {remainingCount > 0 && (
            <p className='text-sm text-muted-foreground'>
              {t('orders.moreItems', { count: remainingCount })}
            </p>
          )}
        </div>

        <Separator className='my-4' />

        <div className='flex items-center justify-between'>
          <div>
            <p className='text-sm text-muted-foreground'>{t('orders.total')}</p>
            <p className='text-lg font-bold'>
              {total.toLocaleString('vi-VN')} VND
            </p>
          </div>
          <div className='flex flex-wrap gap-2'>
            {status === 'SHIPPED' && onTrackOrder && (
              <Button
                size='sm'
                variant='outline'
                onClick={() => onTrackOrder(id)}
              >
                {t('orders.trackOrder')}
              </Button>
            )}
            {status === 'DELIVERED' && onReorder && (
              <Button size='sm' variant='outline' onClick={() => onReorder(id)}>
                {t('orders.reorder')}
              </Button>
            )}
            <Button size='sm' onClick={() => onViewDetails?.(id)}>
              {t('orders.viewDetails')}
              <ChevronRight className='ml-1 h-4 w-4' />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default OrderCard;
