import { useTranslation } from 'react-i18next';
import { IconEye, IconDots } from '@tabler/icons-react';

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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { OrderStatus, OrderTableProps } from '../types';

const DEFAULT_PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

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

export function OrderTable({
  orders,
  onViewDetails,
  pagination,
}: OrderTableProps) {
  const { t } = useTranslation();
  const page = pagination?.page ?? 0;
  const totalPages = pagination?.totalPages ?? 1;
  const onPageChange = pagination?.onPageChange;
  const pageSize = pagination?.pageSize ?? 10;
  const pageSizeOptions =
    pagination?.pageSizeOptions ?? DEFAULT_PAGE_SIZE_OPTIONS;
  const onPageSizeChange = pagination?.onPageSizeChange;

  const getStatusBadge = (status: OrderStatus) => {
    const config = statusConfig[status];
    return (
      <Badge className={config?.className ?? 'bg-gray-500'}>
        {t(`admin.orders.status.${status.toLowerCase()}`, status)}
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
            <TableHead className='text-right'>
              {t('admin.orders.table.items')}
            </TableHead>
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
            <TableRow key={order.orderId}>
              <TableCell className='font-medium'>{order.orderCode}</TableCell>
              <TableCell>
                <div>
                  <p className='font-medium'>{order.customerName}</p>
                  <p className='text-xs text-muted-foreground'>
                    {order.customerEmail}
                  </p>
                </div>
              </TableCell>
              <TableCell className='text-right'>{order.itemCount}</TableCell>
              <TableCell className='text-right'>
                {order.totalAmount.toLocaleString('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                })}
              </TableCell>
              <TableCell>{getStatusBadge(order.orderStatus)}</TableCell>
              <TableCell className='text-sm text-muted-foreground'>
                {formatDate(order.orderDate)}
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
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {pagination != null && (
        <div className='flex flex-wrap items-center justify-between gap-4 border-t px-4 py-3'>
          <div className='flex items-center gap-2'>
            <span className='text-sm text-muted-foreground'>
              {t('admin.orders.pageSize', 'Hiển thị')}
            </span>
            <Select
              value={String(pageSize)}
              onValueChange={(v) => onPageSizeChange?.(Number(v))}
            >
              <SelectTrigger className='h-9 w-[72px]'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className='text-sm text-muted-foreground'>
              {t('admin.orders.pageSizeUnit', '/ trang')}
            </span>
          </div>
          <Pagination className='mx-0 w-auto'>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href='#'
                  onClick={(e) => {
                    e.preventDefault();
                    if (page > 0) onPageChange?.(page - 1);
                  }}
                  className={page <= 0 ? 'pointer-events-none opacity-50' : ''}
                  aria-disabled={page <= 0}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i).map((i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href='#'
                    isActive={i === page}
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange?.(i);
                    }}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href='#'
                  onClick={(e) => {
                    e.preventDefault();
                    if (page < totalPages - 1) onPageChange?.(page + 1);
                  }}
                  className={
                    page >= totalPages - 1
                      ? 'pointer-events-none opacity-50'
                      : ''
                  }
                  aria-disabled={page >= totalPages - 1}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
