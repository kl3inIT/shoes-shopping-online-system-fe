import { useTranslation } from 'react-i18next';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useDashboardTopSelling } from '@/features/admin/dashboard/api/dashboardApi';

export function TopSellingShoesTable() {
  const { t } = useTranslation();
  const { data: topSelling = [], isLoading } = useDashboardTopSelling();

  return (
    <div className='px-4 lg:px-6 mb-8'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-xl font-bold tracking-tight'>
          {t('admin.dashboard.topSelling.title', {
            defaultValue: 'Top Selling Shoes',
          })}
        </h2>
      </div>
      <div className='rounded-md border bg-card text-card-foreground'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                {t('admin.dashboard.topSelling.columns.productName', {
                  defaultValue: 'Product Name',
                })}
              </TableHead>
              <TableHead>
                {t('admin.dashboard.topSelling.columns.category', {
                  defaultValue: 'Category',
                })}
              </TableHead>
              <TableHead className='text-right'>
                {t('admin.dashboard.topSelling.columns.totalSold', {
                  defaultValue: 'Total Sold',
                })}
              </TableHead>
              <TableHead className='text-right'>
                {t('admin.dashboard.topSelling.columns.currentStock', {
                  defaultValue: 'Current Stock',
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
            ) : topSelling.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className='text-center py-6 text-muted-foreground'
                >
                  {t('admin.dashboard.topSelling.empty', {
                    defaultValue: 'No selling data.',
                  })}
                </TableCell>
              </TableRow>
            ) : (
              topSelling.map((shoe) => (
                <TableRow key={shoe.productName + shoe.categoryName}>
                  <TableCell className='font-medium'>
                    {shoe.productName}
                  </TableCell>
                  <TableCell>{shoe.categoryName}</TableCell>
                  <TableCell className='text-right'>{shoe.totalSold}</TableCell>
                  <TableCell className='text-right'>
                    {shoe.currentStock}
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
