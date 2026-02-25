import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QrPaymentCard, type QrPaymentInfo } from '@/features/qr';
import { use, useEffect } from 'react';
import { WebSocketContext } from '@/providers';

export function PaymentQrPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const paymentInfo: QrPaymentInfo = {
    amount: 2000,
    accountName: 'NHU DINH NHAT',
    accountNumber: '22226376222',
    bankName: 'TPBank',
    orderCode: 'SSOS-OD3423-JSKDF',
  };

  // const stompClient = use(WebSocketContext);
  // useEffect(() => {
  //   if (!stompClient) return;

  //   const subscription = stompClient.subscribe('/user/queue/orders', (msg) => {
  //     console.log('QR nhận:', msg.body);
  //   });

  //   return () => {
  //     subscription.unsubscribe();
  //   };
  // }, [stompClient]);

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
