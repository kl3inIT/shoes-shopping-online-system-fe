import { useTranslation } from 'react-i18next';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useCountdown } from '../hooks/useCountDown';
import type { SePayQrCardProps } from '../types';

function buildSePayQrUrl({
  account,
  bank,
  amount,
  description,
}: SePayQrCardProps) {
  const params = new URLSearchParams();
  params.set('acc', account);
  params.set('bank', bank);

  if (amount !== undefined && amount !== null && amount !== '') {
    params.set('amount', String(amount));
  }

  if (description) {
    params.set('des', description);
  }

  return `https://qr.sepay.vn/img?${params.toString()}`;
}

function formatTime(secondsLeft: number) {
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
    2,
    '0'
  )}`;
}

export function SePayQrCard({
  account,
  bank,
  amount,
  description,
  expiredAt,
}: SePayQrCardProps) {
  const { t } = useTranslation();
  const qrUrl = buildSePayQrUrl({
    account,
    bank,
    amount,
    description,
    expiredAt,
  });

  const { secondsLeft, isExpired } = useCountdown(expiredAt);

  return (
    <Card className='max-w-xl'>
      <CardHeader className='flex flex-row items-start justify-between gap-4'>
        <div className='space-y-2'>
          <CardTitle>{t('qr.title')}</CardTitle>
          <CardDescription>{t('qr.subtitle')}</CardDescription>
        </div>
        <div className='text-lg font-semibold text-red-500'>
          {formatTime(secondsLeft)}
        </div>
      </CardHeader>
      <CardContent className='grid gap-6 md:grid-cols-[220px_1fr]'>
        <div className='flex items-center justify-center rounded-lg border bg-muted/20 p-4'>
          <img
            src={qrUrl}
            alt={t('qr.previewAlt')}
            className='h-52 w-52 rounded-md'
            loading='lazy'
          />
        </div>
        <div className='space-y-3 text-sm'>
          <div className='grid grid-cols-[120px_1fr] gap-2'>
            <span className='text-muted-foreground'>
              {t('qr.labels.account')}
            </span>
            <span className='font-medium'>{account}</span>
          </div>
          <div className='grid grid-cols-[120px_1fr] gap-2'>
            <span className='text-muted-foreground'>{t('qr.labels.bank')}</span>
            <span className='font-medium'>{bank}</span>
          </div>
          <div className='grid grid-cols-[120px_1fr] gap-2'>
            <span className='text-muted-foreground'>
              {t('qr.labels.amount')}
            </span>
            <span className='font-medium'>{amount ?? '-'}</span>
          </div>
          <div className='grid grid-cols-[120px_1fr] gap-2'>
            <span className='text-muted-foreground'>
              {t('qr.labels.description')}
            </span>
            <span className='font-medium'>{description ?? '-'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
