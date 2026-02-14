import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface OrderStatsCardsProps {
  newOrders: number;
  processing: number;
  shipped: number;
  revenue: number;
}

export function OrderStatsCards({
  newOrders,
  processing,
  shipped,
  revenue,
}: OrderStatsCardsProps) {
  const { t } = useTranslation();

  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between pb-2'>
          <CardTitle className='text-sm font-medium'>
            {t('admin.orders.stats.newOrders')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold text-blue-600'>{newOrders}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between pb-2'>
          <CardTitle className='text-sm font-medium'>
            {t('admin.orders.stats.processing')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold text-yellow-600'>{processing}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between pb-2'>
          <CardTitle className='text-sm font-medium'>
            {t('admin.orders.stats.shipped')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold text-purple-600'>{shipped}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between pb-2'>
          <CardTitle className='text-sm font-medium'>
            {t('admin.orders.stats.revenue')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold text-green-600'>${revenue}</div>
        </CardContent>
      </Card>
    </div>
  );
}
