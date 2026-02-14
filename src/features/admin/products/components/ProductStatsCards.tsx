import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProductStatsCardsProps {
  total: number;
  active: number;
  outOfStock: number;
  lowStock: number;
}

export function ProductStatsCards({
  total,
  active,
  outOfStock,
  lowStock,
}: ProductStatsCardsProps) {
  const { t } = useTranslation();

  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between pb-2'>
          <CardTitle className='text-sm font-medium'>
            {t('admin.products.stats.total')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{total}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between pb-2'>
          <CardTitle className='text-sm font-medium'>
            {t('admin.products.stats.active')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold text-green-600'>{active}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between pb-2'>
          <CardTitle className='text-sm font-medium'>
            {t('admin.products.stats.outOfStock')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold text-red-600'>{outOfStock}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between pb-2'>
          <CardTitle className='text-sm font-medium'>
            {t('admin.products.stats.lowStock')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold text-orange-600'>{lowStock}</div>
        </CardContent>
      </Card>
    </div>
  );
}
