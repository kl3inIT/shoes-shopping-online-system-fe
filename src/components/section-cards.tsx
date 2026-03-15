import { IconTrendingUp } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getErrorMessage } from '@/features/apiClient';
import { useDashboardMetrics } from '@/features/admin/dashboard/api/dashboardApi';

const formatCurrency = (value: number, locale: string) =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);

export function SectionCards() {
  const { t, i18n } = useTranslation();
  const { data, error, isError, isLoading } = useDashboardMetrics();
  const locale = i18n.language.startsWith('vi') ? 'vi-VN' : 'en-US';

  const totalRevenue = data?.totalRevenue ?? 0;
  const totalCustomers = data?.totalCustomers ?? 0;
  const totalOrders = data?.totalOrders ?? 0;
  const productsSold = data?.productsSold ?? 0;

  const metricTrendLabel = isError
    ? getErrorMessage(error)
    : t('admin.dashboard.cards.liveData', {
        defaultValue: 'Live backend data',
      });

  return (
    <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4'>
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>
            {t('admin.dashboard.cards.totalRevenue.title', {
              defaultValue: 'Total Revenue',
            })}
          </CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {isLoading ? '...' : formatCurrency(totalRevenue, locale)}
          </CardTitle>
          <CardAction>
            <Badge variant='outline'>
              <IconTrendingUp />
              {t('admin.dashboard.cards.badge.live', { defaultValue: 'Live' })}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='line-clamp-1 flex gap-2 font-medium'>
            {metricTrendLabel} <IconTrendingUp className='size-4' />
          </div>
          <div className='text-muted-foreground'>
            {t('admin.dashboard.cards.totalRevenue.description', {
              defaultValue: 'Based on delivered orders',
            })}
          </div>
        </CardFooter>
      </Card>
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>
            {t('admin.dashboard.cards.totalCustomers.title', {
              defaultValue: 'Total Customers',
            })}
          </CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {isLoading ? '...' : totalCustomers.toLocaleString(locale)}
          </CardTitle>
          <CardAction>
            <Badge variant='outline'>
              <IconTrendingUp />
              {t('admin.dashboard.cards.badge.live', { defaultValue: 'Live' })}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='line-clamp-1 flex gap-2 font-medium'>
            {metricTrendLabel} <IconTrendingUp className='size-4' />
          </div>
          <div className='text-muted-foreground'>
            {t('admin.dashboard.cards.totalCustomers.description', {
              defaultValue: 'Registered customer accounts',
            })}
          </div>
        </CardFooter>
      </Card>
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>
            {t('admin.dashboard.cards.totalOrders.title', {
              defaultValue: 'Total Orders',
            })}
          </CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {isLoading ? '...' : totalOrders.toLocaleString(locale)}
          </CardTitle>
          <CardAction>
            <Badge variant='outline'>
              <IconTrendingUp />
              {t('admin.dashboard.cards.badge.live', { defaultValue: 'Live' })}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='line-clamp-1 flex gap-2 font-medium'>
            {metricTrendLabel} <IconTrendingUp className='size-4' />
          </div>
          <div className='text-muted-foreground'>
            {t('admin.dashboard.cards.totalOrders.description', {
              defaultValue: 'Delivered orders only',
            })}
          </div>
        </CardFooter>
      </Card>
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>
            {t('admin.dashboard.cards.productsSold.title', {
              defaultValue: 'Products Sold',
            })}
          </CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {isLoading ? '...' : productsSold.toLocaleString(locale)}
          </CardTitle>
          <CardAction>
            <Badge variant='outline'>
              <IconTrendingUp />
              {t('admin.dashboard.cards.badge.live', { defaultValue: 'Live' })}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='line-clamp-1 flex gap-2 font-medium'>
            {metricTrendLabel} <IconTrendingUp className='size-4' />
          </div>
          <div className='text-muted-foreground'>
            {t('admin.dashboard.cards.productsSold.description', {
              defaultValue: 'All delivered line items',
            })}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
