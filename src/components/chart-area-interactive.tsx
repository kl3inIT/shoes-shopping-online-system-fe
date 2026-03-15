'use client';

import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import { useIsMobile } from '@/hooks/useMobile';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useDashboardChart } from '@/features/admin/dashboard/api/dashboardApi';
import { getErrorMessage } from '@/features/apiClient';

export const description = 'An interactive area chart';

export function ChartAreaInteractive() {
  const { t, i18n } = useTranslation();
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState('90d');
  const locale = i18n.language.startsWith('vi') ? 'vi-VN' : 'en-US';

  const chartConfig = React.useMemo(
    () =>
      ({
        visitors: {
          label: t('admin.dashboard.chart.labels.visitors', {
            defaultValue: 'Visitors',
          }),
        },
        revenue: {
          label: t('admin.dashboard.chart.labels.revenue', {
            defaultValue: 'Revenue',
          }),
          color: 'var(--primary)',
        },
        profit: {
          label: t('admin.dashboard.chart.labels.profit', {
            defaultValue: 'Profit',
          }),
          color: 'var(--primary)',
        },
      }) satisfies ChartConfig,
    [t]
  );

  const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
  const {
    data: apiData = [],
    error,
    isError,
    isLoading,
    refetch,
  } = useDashboardChart(days);

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange('7d');
    }
  }, [isMobile]);

  const filteredData = apiData
    .map((point) => ({
      date: point.date,
      revenue: Number.isFinite(point.revenue) ? point.revenue : 0,
      profit: Number.isFinite(point.profit) ? point.profit : 0,
    }))
    .filter((point) => !Number.isNaN(new Date(point.date).getTime()));

  const chartErrorMessage = getErrorMessage(error);

  return (
    <Card className='@container/card'>
      <CardHeader>
        <CardTitle>
          {t('admin.dashboard.chart.title', {
            defaultValue: 'Total Revenue & Profit',
          })}
        </CardTitle>
        <CardDescription>
          <span className='hidden @[540px]/card:block'>
            {t('admin.dashboard.chart.description.long', {
              defaultValue: 'Total for the last 3 months',
            })}
          </span>
          <span className='@[540px]/card:hidden'>
            {t('admin.dashboard.chart.description.short', {
              defaultValue: 'Last 3 months',
            })}
          </span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type='single'
            value={timeRange}
            onValueChange={(value) => {
              if (value) {
                setTimeRange(value);
              }
            }}
            variant='outline'
            className='hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex'
          >
            <ToggleGroupItem value='90d'>
              {t('admin.dashboard.chart.ranges.90d', {
                defaultValue: 'Last 3 months',
              })}
            </ToggleGroupItem>
            <ToggleGroupItem value='30d'>
              {t('admin.dashboard.chart.ranges.30d', {
                defaultValue: 'Last 30 days',
              })}
            </ToggleGroupItem>
            <ToggleGroupItem value='7d'>
              {t('admin.dashboard.chart.ranges.7d', {
                defaultValue: 'Last 7 days',
              })}
            </ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className='flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden'
              size='sm'
              aria-label={t('admin.dashboard.chart.selectLabel', {
                defaultValue: 'Select a time range',
              })}
            >
              <SelectValue
                placeholder={t('admin.dashboard.chart.ranges.90d', {
                  defaultValue: 'Last 3 months',
                })}
              />
            </SelectTrigger>
            <SelectContent className='rounded-xl'>
              <SelectItem value='90d' className='rounded-lg'>
                {t('admin.dashboard.chart.ranges.90d', {
                  defaultValue: 'Last 3 months',
                })}
              </SelectItem>
              <SelectItem value='30d' className='rounded-lg'>
                {t('admin.dashboard.chart.ranges.30d', {
                  defaultValue: 'Last 30 days',
                })}
              </SelectItem>
              <SelectItem value='7d' className='rounded-lg'>
                {t('admin.dashboard.chart.ranges.7d', {
                  defaultValue: 'Last 7 days',
                })}
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        {isError ? (
          <div className='flex h-[250px] flex-col items-center justify-center gap-3 text-sm text-muted-foreground'>
            <p>{chartErrorMessage}</p>
            <button
              className='text-primary underline underline-offset-4'
              onClick={() => refetch()}
              type='button'
            >
              {t('common.retry', { defaultValue: 'Retry' })}
            </button>
          </div>
        ) : isLoading ? (
          <div className='flex h-[250px] items-center justify-center text-sm text-muted-foreground'>
            {t('common.loading', { defaultValue: 'Loading...' })}
          </div>
        ) : filteredData.length === 0 ? (
          <div className='flex h-[250px] items-center justify-center text-sm text-muted-foreground'>
            {t('admin.dashboard.chart.empty', {
              defaultValue: 'No chart data available for this period.',
            })}
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className='aspect-auto h-[250px] w-full'
          >
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id='fillRevenue' x1='0' y1='0' x2='0' y2='1'>
                  <stop
                    offset='5%'
                    stopColor='var(--color-revenue)'
                    stopOpacity={1.0}
                  />
                  <stop
                    offset='95%'
                    stopColor='var(--color-revenue)'
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id='fillProfit' x1='0' y1='0' x2='0' y2='1'>
                  <stop
                    offset='5%'
                    stopColor='var(--color-profit)'
                    stopOpacity={0.8}
                  />
                  <stop
                    offset='95%'
                    stopColor='var(--color-profit)'
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey='date'
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString(locale, {
                    month: 'short',
                    day: 'numeric',
                  });
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString(locale, {
                        month: 'short',
                        day: 'numeric',
                      });
                    }}
                    indicator='dot'
                  />
                }
              />
              <Area
                dataKey='profit'
                type='natural'
                fill='url(#fillProfit)'
                stroke='var(--color-profit)'
                stackId='a'
              />
              <Area
                dataKey='revenue'
                type='natural'
                fill='url(#fillRevenue)'
                stroke='var(--color-revenue)'
                stackId='a'
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
