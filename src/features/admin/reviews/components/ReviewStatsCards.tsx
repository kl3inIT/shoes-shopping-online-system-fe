import { useTranslation } from 'react-i18next';
import { IconStarFilled } from '@tabler/icons-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ReviewStatsCardsProps {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  avgRating: string;
}

export function ReviewStatsCards({
  total,
  pending,
  approved,
  rejected,
  avgRating,
}: ReviewStatsCardsProps) {
  const { t } = useTranslation();

  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-5'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between pb-2'>
          <CardTitle className='text-sm font-medium'>
            {t('admin.reviews.stats.total')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{total}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between pb-2'>
          <CardTitle className='text-sm font-medium'>
            {t('admin.reviews.stats.pending')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold text-yellow-600'>{pending}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between pb-2'>
          <CardTitle className='text-sm font-medium'>
            {t('admin.reviews.stats.approved')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold text-green-600'>{approved}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between pb-2'>
          <CardTitle className='text-sm font-medium'>
            {t('admin.reviews.stats.rejected')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold text-red-600'>{rejected}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between pb-2'>
          <CardTitle className='text-sm font-medium'>
            {t('admin.reviews.stats.avgRating')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex items-center gap-2'>
            <span className='text-2xl font-bold'>{avgRating}</span>
            <IconStarFilled className='h-5 w-5 text-yellow-500' />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
