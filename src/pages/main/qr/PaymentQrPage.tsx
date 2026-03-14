import { use, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

import {
  QrPaymentCard,
  usePaymentInfoQuery,
  type QrPaymentInfo,
} from '@/features/qr';
import { WebSocketContext } from '@/providers';

export function PaymentQrPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { orderId } = useParams();

  const { data } = usePaymentInfoQuery(orderId);

  const paymentInfo: QrPaymentInfo = {
    amount: data?.amount ?? 0,
    accountName: data?.accountHolder ?? 'NHU DINH NHAT',
    accountNumber: data?.bankNumber ?? '22226376222',
    bankName: data?.bankCode ?? 'TPBank',
    orderCode: data?.orderCode ?? 'SSOS-OD3423-JSKDF',
  };

  const stompClient = use(WebSocketContext);

  useEffect(() => {
    if (!stompClient) return;

    const subscription = stompClient.subscribe('/topic/orders', (msg) => {
      console.log('QR nhận:', msg.body);
      navigate('/orders');
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, stompClient]);

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-8'>
        <Button variant='ghost' className='mb-2' onClick={() => navigate(-1)}>
          <ArrowLeft className='mr-2 h-4 w-4' />
          {t('common.back')}
        </Button>
        <h1 className='text-3xl font-bold'>{t('qr.pageTitle')}</h1>
        <p className='text-muted-foreground'>{t('qr.subtitle')}</p>
      </div>

      <QrPaymentCard info={paymentInfo} />
    </div>
  );
}

export default PaymentQrPage;
