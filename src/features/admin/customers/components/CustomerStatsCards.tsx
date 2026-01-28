import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CustomerStatsCardsProps {
  total: number;
  active: number;
  inactive: number;
  banned: number;
}

export function CustomerStatsCards({
  total,
  active,
  inactive,
  banned,
}: CustomerStatsCardsProps) {
  const { t } = useTranslation();

  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between pb-2'>
          <CardTitle className='text-sm font-medium'>
            {t('admin.customers.stats.total')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{total}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between pb-2'>
          <CardTitle className='text-sm font-medium'>
            {t('admin.customers.stats.active')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold text-green-600'>{active}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between pb-2'>
          <CardTitle className='text-sm font-medium'>
            {t('admin.customers.stats.inactive')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold text-gray-600'>{inactive}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between pb-2'>
          <CardTitle className='text-sm font-medium'>
            {t('admin.customers.stats.banned')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold text-red-600'>{banned}</div>
        </CardContent>
      </Card>
    </div>
  );
}
