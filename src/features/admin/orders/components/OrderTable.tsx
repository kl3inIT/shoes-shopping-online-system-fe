import { useTranslation } from 'react-i18next';
import {
  IconEye,
  IconDots,
  IconPackage,
  IconTruck,
  IconCheck,
  IconX,
} from '@tabler/icons-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type OrderStatus =
  | 'PLACED'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export interface OrderItem {
  id: string;
  productName: string;
  productImage: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingName: string;
  shippingPhone: string;
  shippingEmail: string;
  shippingAddress: string;
  paymentMethod: string;
  paymentTransactionId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderTableProps {
  orders: Order[];
  onViewDetails?: (order: Order) => void;
  onUpdateStatus?: (orderId: string, status: OrderStatus) => void;
}

export function OrderTable({
  orders,
  onViewDetails,
  onUpdateStatus,
}: OrderTableProps) {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className='rounded-lg border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('admin.orders.table.orderNumber')}</TableHead>
            <TableHead>{t('admin.orders.table.customer')}</TableHead>
            <TableHead>{t('admin.orders.table.items')}</TableHead>
            <TableHead className='text-right'>
              {t('admin.orders.table.total')}
            </TableHead>
            <TableHead>{t('admin.orders.table.status')}</TableHead>
            <TableHead>{t('admin.orders.table.date')}</TableHead>
            <TableHead className='text-right'>
              {t('admin.orders.table.actions')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className='font-medium'>{order.orderNumber}</TableCell>
              <TableCell>
                <div>
                  <p className='font-medium'>{order.customer.name}</p>
                  <p className='text-xs text-muted-foreground'>
                    {order.customer.email}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className='flex items-center gap-2'>
                  {order.items.slice(0, 2).map((item) => (
                    <img
                      key={item.id}
                      src={item.productImage}
                      alt={item.productName}
                      className='h-8 w-8 rounded object-cover'
                    />
                  ))}
                  {order.items.length > 2 && (
                    <span className='text-xs text-muted-foreground'>
                      +{order.items.length - 2}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className='text-right'>${order.totalAmount}</TableCell>
              <TableCell>{getStatusBadge(order.status)}</TableCell>
              <TableCell className='text-sm text-muted-foreground'>
                {formatDate(order.createdAt)}
              </TableCell>
              <TableCell className='text-right'>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='ghost' size='icon'>
                      <IconDots className='h-4 w-4' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem onClick={() => onViewDetails?.(order)}>
                      <IconEye className='mr-2 h-4 w-4' />
                      {t('admin.orders.actions.viewDetails')}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {order.status === 'PLACED' && (
                      <DropdownMenuItem
                        onClick={() => onUpdateStatus?.(order.id, 'CONFIRMED')}
                      >
                        <IconCheck className='mr-2 h-4 w-4' />
                        {t('admin.orders.actions.confirm')}
                      </DropdownMenuItem>
                    )}
                    {order.status === 'CONFIRMED' && (
                      <DropdownMenuItem
                        onClick={() => onUpdateStatus?.(order.id, 'PROCESSING')}
                      >
                        <IconPackage className='mr-2 h-4 w-4' />
                        {t('admin.orders.actions.process')}
                      </DropdownMenuItem>
                    )}
                    {order.status === 'PROCESSING' && (
                      <DropdownMenuItem
                        onClick={() => onUpdateStatus?.(order.id, 'SHIPPED')}
                      >
                        <IconTruck className='mr-2 h-4 w-4' />
                        {t('admin.orders.actions.ship')}
                      </DropdownMenuItem>
                    )}
                    {order.status === 'SHIPPED' && (
                      <DropdownMenuItem
                        onClick={() => onUpdateStatus?.(order.id, 'DELIVERED')}
                      >
                        <IconCheck className='mr-2 h-4 w-4' />
                        {t('admin.orders.actions.deliver')}
                      </DropdownMenuItem>
                    )}
                    {!['DELIVERED', 'CANCELLED'].includes(order.status) && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className='text-destructive'
                          onClick={() =>
                            onUpdateStatus?.(order.id, 'CANCELLED')
                          }
                        >
                          <IconX className='mr-2 h-4 w-4' />
                          {t('admin.orders.actions.cancel')}
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
