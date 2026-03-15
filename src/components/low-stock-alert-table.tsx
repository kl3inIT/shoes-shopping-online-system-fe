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
import { Button } from '@/components/ui/button';
import { getErrorMessage } from '@/features/apiClient';
import { useDashboardLowStock } from '@/features/admin/dashboard/api/dashboardApi';

export function LowStockAlertTable() {
  const { t } = useTranslation();
  const {
    data: lowStockItems = [],
    error,
    isError,
    isLoading,
    refetch,
  } = useDashboardLowStock();

  return (
    <div className='px-4 lg:px-6 mb-8'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-xl font-bold tracking-tight'>
          {t('admin.dashboard.lowStock.title', {
            defaultValue: 'Low Stock Alert',
          })}
        </h2>
      </div>
      <div className='rounded-md border bg-card text-card-foreground'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                {t('admin.dashboard.lowStock.columns.productName', {
                  defaultValue: 'Product Name',
                })}
              </TableHead>
              <TableHead>
                {t('admin.dashboard.lowStock.columns.size', {
                  defaultValue: 'Size',
                })}
              </TableHead>
              <TableHead className='text-right'>
                {t('admin.dashboard.lowStock.columns.remaining', {
                  defaultValue: 'Remaining',
                })}
              </TableHead>
              <TableHead className='text-right'>
                {t('admin.dashboard.lowStock.columns.status', {
                  defaultValue: 'Status',
                })}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className='text-center py-6 text-muted-foreground'
                >
                  {t('common.loading', { defaultValue: 'Loading...' })}
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={4} className='text-center py-6'>
                  <div className='flex flex-col items-center gap-2 text-sm'>
                    <p className='text-destructive'>{getErrorMessage(error)}</p>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => refetch()}
                    >
                      {t('common.retry', { defaultValue: 'Retry' })}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : lowStockItems.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className='text-center py-6 text-muted-foreground'
                >
                  {t('admin.dashboard.lowStock.empty', {
                    defaultValue: 'No low stock items.',
                  })}
                </TableCell>
              </TableRow>
            ) : (
              lowStockItems.map((item) => (
                <TableRow key={item.productName + item.size}>
                  <TableCell className='font-medium'>
                    {item.productName}
                  </TableCell>
                  <TableCell>{item.size}</TableCell>
                  <TableCell className='text-right text-destructive font-bold'>
                    {item.remaining}
                  </TableCell>
                  <TableCell className='text-right'>
                    <Badge
                      variant={
                        item.status === 'Out of Stock' ||
                        item.status === 'Critical'
                          ? 'destructive'
                          : 'secondary'
                      }
                    >
                      {t(
                        `admin.dashboard.lowStock.status.${toStatusKey(item.status)}`,
                        { defaultValue: item.status }
                      )}
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

function toStatusKey(status: string) {
  return status
    .trim()
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((part, index) =>
      index === 0 ? part : `${part[0]?.toUpperCase() ?? ''}${part.slice(1)}`
    )
    .join('');
}
