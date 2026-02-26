import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { QrPaymentCardProps } from '../types';

export function QrPaymentCard({ className, info }: QrPaymentCardProps) {
  const { t } = useTranslation();

  const { amount, accountName, accountNumber, bankName, orderCode } = info;

  const qrUrl = `https://qr.sepay.vn/img?acc=${encodeURIComponent(
    accountNumber
  )}&bank=${encodeURIComponent(bankName ?? '')}&amount=${amount}&des=${encodeURIComponent(
    orderCode
  )}`;

  const formattedAmount =
    new Intl.NumberFormat('vi-VN').format(amount) + ' VND';

  return (
    <Card className={cn('max-w-3xl mx-auto shadow-lg', className)}>
      <CardHeader>
        <CardTitle className='flex items-center justify-between gap-2'>
          <span>{t('qr.pageTitle')}</span>
          <Badge variant='outline' className='text-xs font-normal'>
            {t('qr.labels.orderCode')}: {orderCode}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid gap-6 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1.2fr)]'>
          {/* QR bên trái */}
          <div className='flex flex-col items-center justify-center'>
            <div className='rounded-xl border bg-muted p-4'>
              <img
                src={qrUrl}
                alt={t('qr.previewAlt')}
                className='h-64 w-64 rounded-lg object-contain'
              />
            </div>
            <p className='mt-3 text-xs text-muted-foreground'>
              {t('qr.qrNote')}
            </p>
          </div>

          {/* Thông tin bên phải */}
          <div className='space-y-4'>
            <div>
              <p className='text-sm text-muted-foreground'>
                {t('qr.labels.amount')}
              </p>
              <p className='text-2xl font-semibold text-primary'>
                {formattedAmount}
              </p>
            </div>

            <Separator />

            <div className='space-y-2 text-sm'>
              <div className='flex justify-between gap-4'>
                <span className='text-muted-foreground'>
                  {t('qr.labels.accountName')}
                </span>
                <span className='font-medium text-right'>{accountName}</span>
              </div>
              <div className='flex justify-between gap-4'>
                <span className='text-muted-foreground'>
                  {t('qr.labels.accountNumber')}
                </span>
                <span className='font-mono text-right'>{accountNumber}</span>
              </div>
              {bankName && (
                <div className='flex justify-between gap-4'>
                  <span className='text-muted-foreground'>
                    {t('qr.labels.bank')}
                  </span>
                  <span className='font-medium text-right'>{bankName}</span>
                </div>
              )}
              <div className='flex justify-between gap-4'>
                <span className='text-muted-foreground'>
                  {t('qr.labels.orderCode')}
                </span>
                <span className='font-mono text-right'>{orderCode}</span>
              </div>
            </div>

            <Separator />

            <div className='space-y-1 text-sm'>
              <p className='text-muted-foreground'>
                {t('qr.labels.description')}
              </p>
              <p className='rounded-md bg-muted px-3 py-2 text-xs font-medium'>
                {orderCode}
              </p>
            </div>

            <Separator />

            <ul className='space-y-1 text-xs text-muted-foreground'>
              <li>{t('qr.notes.checkInfo')}</li>
              <li>{t('qr.notes.autoUpdate')}</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
