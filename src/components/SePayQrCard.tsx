import { useTranslation } from 'react-i18next';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type SePayQrCardProps = {
  account: string;
  bank: string;
  amount?: number | string;
  description?: string;
};

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

export function SePayQrCard({
  account,
  bank,
  amount,
  description,
}: SePayQrCardProps) {
  const { t } = useTranslation();
  const qrUrl = buildSePayQrUrl({ account, bank, amount, description });

  return (
    <Card className='max-w-xl'>
      <CardHeader>
        <CardTitle>{t('qr.title')}</CardTitle>
        <CardDescription>{t('qr.subtitle')}</CardDescription>
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
