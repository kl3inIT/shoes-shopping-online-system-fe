import { useTranslation } from 'react-i18next';

import { ChartAreaInteractive } from '@/components/chart-area-interactive';
import { LowStockAlertTable } from '@/components/low-stock-alert-table';
import { RecentOrdersTable } from '@/components/recent-orders-table';
import { SectionCards } from '@/components/section-cards';
import { TopSellingShoesTable } from '@/components/top-selling-shoes-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function DashboardPage() {
  const { t } = useTranslation();

  return (
    <>
      <SectionCards />
      <div className='px-4 lg:px-6 mb-4'>
        <ChartAreaInteractive />
      </div>
      <div className='px-4 lg:px-6'>
        <Tabs
          defaultValue='recent-orders'
          className='w-full border rounded-lg p-4 bg-card text-card-foreground'
        >
          <TabsList className='mb-4 bg-muted'>
            <TabsTrigger value='recent-orders'>
              {t('admin.dashboard.tabs.recentOrders', {
                defaultValue: 'Recent Orders',
              })}
            </TabsTrigger>
            <TabsTrigger value='top-selling'>
              {t('admin.dashboard.tabs.topSelling', {
                defaultValue: 'Top Selling',
              })}
            </TabsTrigger>
            <TabsTrigger value='low-stock'>
              {t('admin.dashboard.tabs.lowStock', {
                defaultValue: 'Low Stock Alerts',
              })}
            </TabsTrigger>
          </TabsList>

          <TabsContent value='recent-orders' className='mt-0'>
            <div className='-mx-4 -mb-8 lg:-mx-6'>
              <RecentOrdersTable />
            </div>
          </TabsContent>

          <TabsContent value='top-selling' className='mt-0'>
            <div className='-mx-4 -mb-8 lg:-mx-6'>
              <TopSellingShoesTable />
            </div>
          </TabsContent>

          <TabsContent value='low-stock' className='mt-0'>
            <div className='-mx-4 -mb-8 lg:-mx-6'>
              <LowStockAlertTable />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
