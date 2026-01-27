import { OrderCard, type OrderCardProps } from './OrderCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type OrderFilterStatus =
  | 'all'
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

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
  const filteredOrders =
    activeFilter === 'all'
      ? orders
      : orders.filter((order) => order.status === activeFilter);

  const EmptyState = () => (
    <div className='flex flex-col items-center justify-center py-16 text-center'>
      <Package className='mb-4 h-16 w-16 text-muted-foreground/50' />
      <h3 className='text-lg font-medium'>No orders found</h3>
      <p className='mt-1 text-sm text-muted-foreground'>
        {activeFilter === 'all'
          ? "You haven't placed any orders yet"
          : `No ${activeFilter} orders`}
      </p>
      {onContinueShopping && (
        <Button className='mt-4' onClick={onContinueShopping}>
          Start Shopping
        </Button>
      )}
    </div>
  );

  return (
    <div className='space-y-4'>
      <Tabs
        value={activeFilter}
        onValueChange={(v) => onFilterChange?.(v as OrderFilterStatus)}
      >
        <TabsList className='w-full justify-start overflow-x-auto'>
          <TabsTrigger value='all'>All</TabsTrigger>
          <TabsTrigger value='pending'>Pending</TabsTrigger>
          <TabsTrigger value='processing'>Processing</TabsTrigger>
          <TabsTrigger value='shipped'>Shipped</TabsTrigger>
          <TabsTrigger value='delivered'>Delivered</TabsTrigger>
          <TabsTrigger value='cancelled'>Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value={activeFilter} className='mt-4'>
          {filteredOrders.length === 0 ? (
            <EmptyState />
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
