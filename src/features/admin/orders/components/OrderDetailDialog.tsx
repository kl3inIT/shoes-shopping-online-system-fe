import { useTranslation } from 'react-i18next';

import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

import type { OrderResponse, OrderStatus } from '../types';

const statusConfig: Record<OrderStatus, { className: string }> = {
  PENDING_PAYMENT: { className: 'bg-slate-500' },
  PAYMENT_EXPIRED: { className: 'bg-gray-500' },
  PAID: { className: 'bg-blue-500' },
  CONFIRMED: { className: 'bg-indigo-500' },
  SHIPPED: { className: 'bg-purple-500' },
  DELIVERED: { className: 'bg-green-500' },
  CANCELLED: { className: 'bg-red-500' },
  REFUNDED: { className: 'bg-orange-500' },
};

interface OrderDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: OrderResponse | null;
}

export function OrderDetailDialog({
  open,
  onOpenChange,
  order,
}: OrderDetailDialogProps) {
  const { t } = useTranslation();

  const getStatusBadge = (status: OrderStatus) => {
    const config = statusConfig[status];
    return (
      <Badge className={config?.className ?? 'bg-gray-500'}>
        {t(`admin.orders.status.${status.toLowerCase()}`, status)}
      </Badge>
    );
  };

  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>
            {t('admin.orders.detail.title', { number: order.orderCode })}
          </DialogTitle>
        </DialogHeader>
        <div className='space-y-6'>
          <div className='flex items-center justify-between'>
            <span className='text-muted-foreground'>
              {t('admin.orders.detail.status')}
            </span>
            {getStatusBadge(order.orderStatus)}
          </div>

          <Separator />

          <div>
            <h4 className='mb-2 font-semibold'>
              {t('admin.orders.detail.customer')}
            </h4>
            <div className='grid grid-cols-2 gap-2 text-sm'>
              <div>
                <span className='text-muted-foreground'>
                  {t('admin.orders.detail.name')}:
                </span>{' '}
                {order.customerName}
              </div>
              <div>
                <span className='text-muted-foreground'>
                  {t('admin.orders.detail.email')}:
                </span>{' '}
                {order.customerEmail}
              </div>
            </div>
          </div>

          <Separator />

          <div className='flex items-center justify-between text-sm'>
            <span className='text-muted-foreground'>
              {t('admin.orders.detail.items')}
            </span>
            <span>{order.itemCount}</span>
          </div>

          <Separator />

          <div className='flex items-center justify-between text-lg font-bold'>
            <span>{t('admin.orders.detail.total')}</span>
            <span>${order.totalAmount}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
