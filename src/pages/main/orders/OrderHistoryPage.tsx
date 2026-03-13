import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { FeaturePlaceholder } from '@/components/app';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export function OrderHistoryPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-8'>
        <Button variant='ghost' className='mb-2' onClick={() => navigate(-1)}>
          <ArrowLeft className='mr-2 h-4 w-4' />
          {t('common.back')}
        </Button>
        <h1 className='text-3xl font-bold'>{t('orders.title')}</h1>
        <p className='text-muted-foreground'>{t('orders.subtitle')}</p>
      </div>

      <FeaturePlaceholder
        title='Order history route is reserved, but not connected yet'
        description='The previous customer order screen was backed by local sample orders. It has been replaced with a foundation placeholder until account order APIs and tracking events are available.'
        items={[
          'Add authenticated order-history queries scoped to the current user.',
          'Define detail, reorder, and shipment-tracking endpoints with the backend.',
          'Decide whether order detail should be its own route loader or query-driven page.',
        ]}
        action={
          <Button variant='outline' onClick={() => navigate('/products')}>
            {t('orders.continueShopping', 'Continue shopping')}
          </Button>
        }
      />
    </div>
  );
}

export default OrderHistoryPage;
