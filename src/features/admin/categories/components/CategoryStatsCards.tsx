import { useTranslation } from 'react-i18next';
import { IconFolder } from '@tabler/icons-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CategoryStatsCardsProps {
  total: number;
  totalProducts: number;
}

export function CategoryStatsCards({
  total,
  totalProducts,
}: CategoryStatsCardsProps) {
  const { t } = useTranslation();

  return (
    <div className='grid gap-4 sm:grid-cols-2'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between pb-2'>
          <CardTitle className='text-sm font-medium'>
            {t('admin.categories.stats.total')}
          </CardTitle>
          <IconFolder className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{total}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between pb-2'>
          <CardTitle className='text-sm font-medium'>
            {t('admin.categories.stats.totalProducts')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{totalProducts}</div>
        </CardContent>
      </Card>
    </div>
  );
}
