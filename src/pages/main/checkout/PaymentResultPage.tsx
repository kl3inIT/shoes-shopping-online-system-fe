import { useSearchParams, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Package, ArrowRight } from 'lucide-react';

export function PaymentResultPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const status = searchParams.get('status');
  const orderId = searchParams.get('orderId');

  const isSuccess = status === 'success';

  return (
    <div className='container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-8'>
      <Card className='w-full max-w-md text-center'>
        <CardHeader>
          <div className='mx-auto mb-4'>
            {isSuccess ? (
              <div className='flex h-20 w-20 items-center justify-center rounded-full bg-green-100'>
                <CheckCircle className='h-12 w-12 text-green-600' />
              </div>
            ) : (
              <div className='flex h-20 w-20 items-center justify-center rounded-full bg-red-100'>
                <XCircle className='h-12 w-12 text-red-600' />
              </div>
            )}
          </div>
          <h1 className='text-2xl font-bold'>
            {isSuccess
              ? t('paymentResult.success.title')
              : t('paymentResult.failed.title')}
          </h1>
        </CardHeader>
        <CardContent className='space-y-4'>
          {isSuccess ? (
            <>
              <p className='text-muted-foreground'>
                {t('paymentResult.success.description')}
              </p>
              {orderId && (
                <div className='rounded-lg bg-muted p-4'>
                  <p className='text-sm text-muted-foreground'>
                    {t('paymentResult.success.orderNumber')}
                  </p>
                  <p className='text-lg font-bold'>{orderId}</p>
                </div>
              )}
              <p className='text-sm text-muted-foreground'>
                {t('paymentResult.success.emailSent')}
              </p>
            </>
          ) : (
            <>
              <p className='text-muted-foreground'>
                {t('paymentResult.failed.description')}
              </p>
              <p className='text-sm text-muted-foreground'>
                {t('paymentResult.failed.contactSupport')}
              </p>
            </>
          )}
        </CardContent>
        <CardFooter className='flex flex-col gap-2'>
          {isSuccess ? (
            <>
              <Button className='w-full' onClick={() => navigate('/orders')}>
                <Package className='mr-2 h-4 w-4' />
                {t('paymentResult.success.viewOrders')}
              </Button>
              <Button
                variant='outline'
                className='w-full'
                onClick={() => navigate('/products')}
              >
                {t('paymentResult.success.continueShopping')}
                <ArrowRight className='ml-2 h-4 w-4' />
              </Button>
            </>
          ) : (
            <>
              <Button className='w-full' onClick={() => navigate('/checkout')}>
                {t('paymentResult.failed.tryAgain')}
              </Button>
              <Button
                variant='outline'
                className='w-full'
                onClick={() => navigate('/cart')}
              >
                {t('paymentResult.failed.backToCart')}
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

export default PaymentResultPage;
