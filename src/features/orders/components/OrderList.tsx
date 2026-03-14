import { OrderCard, type OrderCardProps } from './OrderCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

/** Tab filter: All + Confirmed, Delivered, Cancelled */
export type OrderFilterStatus = 'all' | 'CONFIRMED' | 'DELIVERED' | 'CANCELLED';

interface EmptyStateProps {
  activeFilter: OrderFilterStatus;
  onContinueShopping?: () => void;
}

function EmptyState({ activeFilter, onContinueShopping }: EmptyStateProps) {
  const { t } = useTranslation();
  const statusLabelMap: Record<Exclude<OrderFilterStatus, 'all'>, string> = {
    CONFIRMED: t('orders.filter.confirmed', 'Confirmed'),
    DELIVERED: t('orders.filter.delivered', 'Delivered'),
    CANCELLED: t('orders.filter.cancelled', 'Cancelled'),
  };
  const statusLabel =
    activeFilter === 'all' ? '' : statusLabelMap[activeFilter];

  return (
    <div className='flex flex-col items-center justify-center py-16 text-center'>
      <Package className='mb-4 h-16 w-16 text-muted-foreground/50' />
      <h3 className='text-lg font-medium'>{t('orders.empty.title')}</h3>
      <p className='mt-1 text-sm text-muted-foreground'>
        {activeFilter === 'all'
          ? t('orders.empty.allEmpty')
          : t('orders.empty.filteredEmpty', { status: statusLabel })}
      </p>
      {onContinueShopping && (
        <Button className='mt-4' onClick={onContinueShopping}>
          {t('orders.startShopping')}
        </Button>
      )}
    </div>
  );
}

export interface OrderListProps {
  orders: Omit<
    OrderCardProps,
    'onViewDetails' | 'onTrackOrder' | 'onReorder'
  >[];
  activeFilter?: OrderFilterStatus;
  onFilterChange?: (filter: OrderFilterStatus) => void;
  onViewDetails?: (orderId: string) => void;
  onTrackOrder?: (orderId: string) => void;
  onReorder?: (orderId: string) => void;
  onContinueShopping?: () => void;
}

export function OrderList({
  orders,
  activeFilter = 'all',
  onFilterChange,
  onViewDetails,
  onTrackOrder,
  onReorder,
  onContinueShopping,
}: OrderListProps) {
  const { t } = useTranslation();
  const filteredOrders =
    activeFilter === 'all'
      ? orders
      : orders.filter((order) => order.status === activeFilter);

  return (
    <div className='space-y-4'>
      <Tabs
        value={activeFilter}
        onValueChange={(v) => onFilterChange?.(v as OrderFilterStatus)}
      >
        <TabsList className='w-full justify-start overflow-x-auto'>
          <TabsTrigger value='all'>{t('orders.filter.all')}</TabsTrigger>
          <TabsTrigger value='CONFIRMED'>
            {t('orders.filter.confirmed', 'Confirmed')}
          </TabsTrigger>
          <TabsTrigger value='DELIVERED'>
            {t('orders.filter.delivered')}
          </TabsTrigger>
          <TabsTrigger value='CANCELLED'>
            {t('orders.filter.cancelled')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeFilter} className='mt-4'>
          {filteredOrders.length === 0 ? (
            <EmptyState
              activeFilter={activeFilter}
              onContinueShopping={onContinueShopping}
            />
          ) : (
            <div className='space-y-4'>
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  {...order}
                  onViewDetails={onViewDetails}
                  onTrackOrder={onTrackOrder}
                  onReorder={onReorder}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default OrderList;
