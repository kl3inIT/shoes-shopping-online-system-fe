import { useTranslation } from 'react-i18next';
import { IconPackage, IconTruck, IconCheck, IconX } from '@tabler/icons-react';

import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

import type { Order, OrderStatus } from './OrderTable';

interface OrderDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
}

export function OrderDetailDialog({
  open,
  onOpenChange,
  order,
}: OrderDetailDialogProps) {
  const { t } = useTranslation();

  const getStatusBadge = (status: OrderStatus) => {
    const statusConfig: Record<
      OrderStatus,
      { className: string; icon: React.ReactNode }
    > = {
      PLACED: {
        className: 'bg-blue-500',
        icon: <IconPackage className='mr-1 h-3 w-3' />,
      },
      CONFIRMED: {
        className: 'bg-indigo-500',
        icon: <IconCheck className='mr-1 h-3 w-3' />,
      },
      PROCESSING: {
        className: 'bg-yellow-500',
        icon: <IconPackage className='mr-1 h-3 w-3' />,
      },
      SHIPPED: {
        className: 'bg-purple-500',
        icon: <IconTruck className='mr-1 h-3 w-3' />,
      },
      DELIVERED: {
        className: 'bg-green-500',
        icon: <IconCheck className='mr-1 h-3 w-3' />,
      },
      CANCELLED: {
        className: 'bg-red-500',
        icon: <IconX className='mr-1 h-3 w-3' />,
      },
    };

    const config = statusConfig[status];
    return (
      <Badge className={`${config.className} flex items-center`}>
        {config.icon}
        {t(`admin.orders.status.${status.toLowerCase()}`)}
      </Badge>
    );
  };

  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>
            {t('admin.orders.detail.title', { number: order.orderNumber })}
          </DialogTitle>
        </DialogHeader>
        <div className='space-y-6'>
          {/* Status */}
          <div className='flex items-center justify-between'>
            <span className='text-muted-foreground'>
              {t('admin.orders.detail.status')}
            </span>
            {getStatusBadge(order.status)}
          </div>

          <Separator />

          {/* Customer Info */}
          <div>
            <h4 className='mb-2 font-semibold'>
              {t('admin.orders.detail.customer')}
            </h4>
            <div className='grid grid-cols-2 gap-2 text-sm'>
              <div>
                <span className='text-muted-foreground'>
                  {t('admin.orders.detail.name')}:
                </span>{' '}
                {order.customer.name}
              </div>
              <div>
                <span className='text-muted-foreground'>
                  {t('admin.orders.detail.email')}:
                </span>{' '}
                {order.customer.email}
              </div>
              <div>
                <span className='text-muted-foreground'>
                  {t('admin.orders.detail.phone')}:
                </span>{' '}
                {order.customer.phone}
              </div>
            </div>
          </div>

          <Separator />

          {/* Shipping Info */}
          <div>
            <h4 className='mb-2 font-semibold'>
              {t('admin.orders.detail.shipping')}
            </h4>
            <p className='text-sm'>{order.shippingAddress}</p>
          </div>

          <Separator />

          {/* Items */}
          <div>
            <h4 className='mb-2 font-semibold'>
              {t('admin.orders.detail.items')}
            </h4>
            <div className='space-y-2'>
              {order.items.map((item) => (
                <div key={item.id} className='flex items-center gap-4'>
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className='h-12 w-12 rounded object-cover'
                  />
                  <div className='flex-1'>
                    <p className='font-medium'>{item.productName}</p>
                    <p className='text-xs text-muted-foreground'>
                      {item.size} / {item.color} x {item.quantity}
                    </p>
                  </div>
                  <p className='font-medium'>${item.price * item.quantity}</p>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Total */}
          <div className='flex items-center justify-between text-lg font-bold'>
            <span>{t('admin.orders.detail.total')}</span>
            <span>${order.totalAmount}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
