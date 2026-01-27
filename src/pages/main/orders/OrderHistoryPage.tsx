import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  OrderList,
  OrderTimeline,
  type OrderFilterStatus,
} from '@/features/orders';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { mockOrders, getOrderTimeline } from './data';

export function OrderHistoryPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<OrderFilterStatus>('all');
  const [trackingDialogOpen, setTrackingDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const selectedOrder = mockOrders.find((o) => o.id === selectedOrderId);
  const timeline = selectedOrder ? getOrderTimeline(selectedOrder.status) : [];

  const handleViewDetails = (orderId: string) => {
    console.log('View details:', orderId);
    navigate(`/orders/${orderId}`);
  };

  const handleTrackOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setTrackingDialogOpen(true);
  };

  const handleReorder = (orderId: string) => {
    console.log('Reorder:', orderId);
    navigate('/cart');
  };

  const handleContinueShopping = () => {
    navigate('/products');
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Header */}
      <div className='mb-8'>
        <Button variant='ghost' className='mb-2' onClick={() => navigate(-1)}>
          <ArrowLeft className='mr-2 h-4 w-4' />
          {t('common.back')}
        </Button>
        <h1 className='text-3xl font-bold'>{t('orders.title')}</h1>
        <p className='text-muted-foreground'>{t('orders.subtitle')}</p>
      </div>

      {/* Order List */}
      <OrderList
        orders={mockOrders}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        onViewDetails={handleViewDetails}
        onTrackOrder={handleTrackOrder}
        onReorder={handleReorder}
        onContinueShopping={handleContinueShopping}
      />

      {/* Tracking Dialog */}
      <Dialog open={trackingDialogOpen} onOpenChange={setTrackingDialogOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>
              {t('orders.timeline.title', {
                number: selectedOrder?.orderNumber,
              })}
            </DialogTitle>
          </DialogHeader>
          <div className='py-4'>
            <OrderTimeline steps={timeline} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default OrderHistoryPage;
