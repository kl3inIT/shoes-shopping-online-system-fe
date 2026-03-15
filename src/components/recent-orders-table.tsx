import { useTranslation } from 'react-i18next';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useDashboardRecentOrders } from '@/features/admin/dashboard/api/dashboardApi';

const formatCurrency = (value: number, locale: string) =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);

export function RecentOrdersTable() {
  const { t, i18n } = useTranslation();
  const { data: recentOrders = [], isLoading } = useDashboardRecentOrders();
  const locale = i18n.language.startsWith('vi') ? 'vi-VN' : 'en-US';

  return (
    <div className='px-4 lg:px-6 mb-8'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-xl font-bold tracking-tight'>
          {t('admin.dashboard.recentOrders.title', {
            defaultValue: 'Recent Orders',
          })}
        </h2>
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[140px]'>
                {t('admin.dashboard.recentOrders.columns.orderCode', {
                  defaultValue: 'Order Code',
                })}
              </TableHead>
              <TableHead>
                {t('admin.dashboard.recentOrders.columns.customer', {
                  defaultValue: 'Customer',
                })}
              </TableHead>
              <TableHead>
                {t('admin.dashboard.recentOrders.columns.date', {
                  defaultValue: 'Date',
                })}
              </TableHead>
              <TableHead>
                {t('admin.dashboard.recentOrders.columns.total', {
                  defaultValue: 'Total',
                })}
              </TableHead>
              <TableHead className='text-right'>
                {t('admin.dashboard.recentOrders.columns.status', {
                  defaultValue: 'Status',
                })}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className='text-center py-6 text-muted-foreground'
                >
                  {t('common.loading', { defaultValue: 'Loading...' })}
                </TableCell>
              </TableRow>
            ) : recentOrders.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className='text-center py-6 text-muted-foreground'
                >
                  {t('admin.dashboard.recentOrders.empty', {
                    defaultValue: 'No recent orders.',
                  })}
                </TableCell>
              </TableRow>
            ) : (
              recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className='font-medium'>
                    {order.orderCode}
                  </TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString(locale, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </TableCell>
                  <TableCell>
                    {formatCurrency(order.totalAmount, locale)}
                  </TableCell>
                  <TableCell className='text-right'>
                    <Badge
                      variant={
                        order.status === 'DELIVERED'
                          ? 'default'
                          : order.status === 'PROCESSING' ||
                              order.status === 'CONFIRMED' ||
                              order.status === 'SHIPPED'
                            ? 'secondary'
                            : order.status === 'PENDING_PAYMENT'
                              ? 'outline'
                              : 'destructive'
                      }
                    >
                      {t(`admin.orders.status.${order.status.toLowerCase()}`, {
                        defaultValue: order.status,
                      })}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
