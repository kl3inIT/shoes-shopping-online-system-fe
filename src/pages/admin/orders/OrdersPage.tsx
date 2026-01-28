import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconSearch } from '@tabler/icons-react';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  OrderTable,
  OrderStatsCards,
  OrderDetailDialog,
  type Order,
  type OrderStatus,
} from '@/features/admin/orders';

import { mockOrders, statusOptions } from './data';

export default function AdminOrdersPage() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState(mockOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    newOrders: orders.filter((o) => o.status === 'PLACED').length,
    processing: orders.filter((o) =>
      ['CONFIRMED', 'PROCESSING'].includes(o.status)
    ).length,
    shipped: orders.filter((o) => o.status === 'SHIPPED').length,
    revenue: orders
      .filter((o) => o.status === 'DELIVERED')
      .reduce((sum, o) => sum + o.totalAmount, 0),
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setDetailDialogOpen(true);
  };

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <div className='flex flex-col gap-4 py-4'>
      {/* Header */}
      <div className='flex items-center justify-between px-4 lg:px-6'>
        <div>
          <h1 className='text-2xl font-bold'>{t('admin.orders.title')}</h1>
          <p className='text-muted-foreground'>
            {t('admin.orders.subtitle', { count: filteredOrders.length })}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='px-4 lg:px-6'>
        <OrderStatsCards {...stats} />
      </div>

      {/* Filters */}
      <div className='flex flex-wrap items-center gap-4 px-4 lg:px-6'>
        <div className='relative flex-1 min-w-[200px]'>
          <IconSearch className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
          <Input
            placeholder={t('admin.orders.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pl-10'
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className='w-[150px]'>
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
      </div>

      {/* Table */}
      <div className='px-4 lg:px-6'>
        <OrderTable
          orders={filteredOrders}
          onViewDetails={handleViewDetails}
          onUpdateStatus={handleUpdateStatus}
        />
      </div>

      {/* Order Detail Dialog */}
      <OrderDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        order={selectedOrder}
      />
    </div>
  );
}
