'use client';

import * as React from 'react';
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

export const description = 'An interactive area chart';

// Fallback mock data nếu API chưa có dữ liệu
const fallbackChartData = [
  { date: '2024-04-01', revenue: 222, profit: 150 },
  { date: '2024-04-02', revenue: 97, profit: 180 },
  { date: '2024-04-03', revenue: 167, profit: 120 },
  { date: '2024-04-04', revenue: 242, profit: 260 },
  { date: '2024-04-05', revenue: 373, profit: 290 },
  { date: '2024-04-06', revenue: 301, profit: 340 },
  { date: '2024-04-07', revenue: 245, profit: 180 },
  { date: '2024-04-08', revenue: 409, profit: 320 },
  { date: '2024-04-09', revenue: 59, profit: 110 },
  { date: '2024-04-10', revenue: 261, profit: 190 },
  { date: '2024-04-11', revenue: 327, profit: 350 },
  { date: '2024-04-12', revenue: 292, profit: 210 },
  { date: '2024-04-13', revenue: 342, profit: 380 },
  { date: '2024-04-14', revenue: 137, profit: 220 },
  { date: '2024-04-15', revenue: 120, profit: 170 },
  { date: '2024-04-16', revenue: 138, profit: 190 },
  { date: '2024-04-17', revenue: 446, profit: 360 },
  { date: '2024-04-18', revenue: 364, profit: 410 },
  { date: '2024-04-19', revenue: 243, profit: 180 },
  { date: '2024-04-20', revenue: 89, profit: 150 },
  { date: '2024-04-21', revenue: 137, profit: 200 },
  { date: '2024-04-22', revenue: 224, profit: 170 },
  { date: '2024-04-23', revenue: 138, profit: 230 },
  { date: '2024-04-24', revenue: 387, profit: 290 },
  { date: '2024-04-25', revenue: 215, profit: 250 },
  { date: '2024-04-26', revenue: 75, profit: 130 },
  { date: '2024-04-27', revenue: 383, profit: 420 },
  { date: '2024-04-28', revenue: 122, profit: 180 },
  { date: '2024-04-29', revenue: 315, profit: 240 },
  { date: '2024-04-30', revenue: 454, profit: 380 },
  { date: '2024-05-01', revenue: 165, profit: 220 },
  { date: '2024-05-02', revenue: 293, profit: 310 },
  { date: '2024-05-03', revenue: 247, profit: 190 },
  { date: '2024-05-04', revenue: 385, profit: 420 },
  { date: '2024-05-05', revenue: 481, profit: 390 },
  { date: '2024-05-06', revenue: 498, profit: 520 },
  { date: '2024-05-07', revenue: 388, profit: 300 },
  { date: '2024-05-08', revenue: 149, profit: 210 },
  { date: '2024-05-09', revenue: 227, profit: 180 },
  { date: '2024-05-10', revenue: 293, profit: 330 },
  { date: '2024-05-11', revenue: 335, profit: 270 },
  { date: '2024-05-12', revenue: 197, profit: 240 },
  { date: '2024-05-13', revenue: 197, profit: 160 },
  { date: '2024-05-14', revenue: 448, profit: 490 },
  { date: '2024-05-15', revenue: 473, profit: 380 },
  { date: '2024-05-16', revenue: 338, profit: 400 },
  { date: '2024-05-17', revenue: 499, profit: 420 },
  { date: '2024-05-18', revenue: 315, profit: 350 },
  { date: '2024-05-19', revenue: 235, profit: 180 },
  { date: '2024-05-20', revenue: 177, profit: 230 },
  { date: '2024-05-21', revenue: 82, profit: 140 },
  { date: '2024-05-22', revenue: 81, profit: 120 },
  { date: '2024-05-23', revenue: 252, profit: 290 },
  { date: '2024-05-24', revenue: 294, profit: 220 },
  { date: '2024-05-25', revenue: 201, profit: 250 },
  { date: '2024-05-26', revenue: 213, profit: 170 },
  { date: '2024-05-27', revenue: 420, profit: 460 },
  { date: '2024-05-28', revenue: 233, profit: 190 },
  { date: '2024-05-29', revenue: 78, profit: 130 },
  { date: '2024-05-30', revenue: 340, profit: 280 },
  { date: '2024-05-31', revenue: 178, profit: 230 },
  { date: '2024-06-01', revenue: 178, profit: 200 },
  { date: '2024-06-02', revenue: 470, profit: 410 },
  { date: '2024-06-03', revenue: 103, profit: 160 },
  { date: '2024-06-04', revenue: 439, profit: 380 },
  { date: '2024-06-05', revenue: 88, profit: 140 },
  { date: '2024-06-06', revenue: 294, profit: 250 },
  { date: '2024-06-07', revenue: 323, profit: 370 },
  { date: '2024-06-08', revenue: 385, profit: 320 },
  { date: '2024-06-09', revenue: 438, profit: 480 },
  { date: '2024-06-10', revenue: 155, profit: 200 },
  { date: '2024-06-11', revenue: 92, profit: 150 },
  { date: '2024-06-12', revenue: 492, profit: 420 },
  { date: '2024-06-13', revenue: 81, profit: 130 },
  { date: '2024-06-14', revenue: 426, profit: 380 },
  { date: '2024-06-15', revenue: 307, profit: 350 },
  { date: '2024-06-16', revenue: 371, profit: 310 },
  { date: '2024-06-17', revenue: 475, profit: 520 },
  { date: '2024-06-18', revenue: 107, profit: 170 },
  { date: '2024-06-19', revenue: 341, profit: 290 },
  { date: '2024-06-20', revenue: 408, profit: 450 },
  { date: '2024-06-21', revenue: 169, profit: 210 },
  { date: '2024-06-22', revenue: 317, profit: 270 },
  { date: '2024-06-23', revenue: 480, profit: 530 },
  { date: '2024-06-24', revenue: 132, profit: 180 },
  { date: '2024-06-25', revenue: 141, profit: 190 },
  { date: '2024-06-26', revenue: 434, profit: 380 },
  { date: '2024-06-27', revenue: 448, profit: 490 },
  { date: '2024-06-28', revenue: 149, profit: 200 },
  { date: '2024-06-29', revenue: 103, profit: 160 },
  { date: '2024-06-30', revenue: 446, profit: 400 },
];

const chartConfig = {
  visitors: {
    label: 'Visitors',
  },
  revenue: {
    label: 'Revenue',
    color: 'var(--primary)',
  },
  profit: {
    label: 'Profit',
    color: 'var(--primary)',
  },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState('90d');

  const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
  const { data: apiData = [] } = useDashboardChart(days);

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange('7d');
    }
  }, [isMobile]);

  const sourceData =
    apiData.length > 0
      ? apiData.map((p) => ({
          date: p.date,
          revenue: p.revenue,
          profit: p.profit,
        }))
      : fallbackChartData;

  const filteredData = sourceData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date('2024-06-30');
    let daysToSubtract = 90;
    if (timeRange === '30d') {
      daysToSubtract = 30;
    } else if (timeRange === '7d') {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card className='@container/card'>
      <CardHeader>
        <CardTitle>Total Revenue & Profit</CardTitle>
        <CardDescription>
          <span className='hidden @[540px]/card:block'>
            Total for the last 3 months
          </span>
          <span className='@[540px]/card:hidden'>Last 3 months</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type='single'
            value={timeRange}
            onValueChange={setTimeRange}
            variant='outline'
            className='hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex'
          >
            <ToggleGroupItem value='90d'>Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value='30d'>Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value='7d'>Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className='flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden'
              size='sm'
              aria-label='Select a value'
            >
              <SelectValue placeholder='Last 3 months' />
            </SelectTrigger>
            <SelectContent className='rounded-xl'>
              <SelectItem value='90d' className='rounded-lg'>
                Last 3 months
              </SelectItem>
              <SelectItem value='30d' className='rounded-lg'>
                Last 30 days
              </SelectItem>
              <SelectItem value='7d' className='rounded-lg'>
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
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
                return date.toLocaleDateString('en-US', {
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
                    return new Date(value).toLocaleDateString('en-US', {
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
      </CardContent>
    </Card>
  );
}
