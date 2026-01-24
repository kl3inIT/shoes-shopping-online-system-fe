import { useTranslation } from 'react-i18next';
import { SePayQrCard } from '@/pages/qr/components/SePayQrCard';
import { useSePayQr } from './hooks/useSePayQr';

export function SePayQrPage() {
  const { t } = useTranslation();

  const { data, loading, error } = useSePayQr();

  if (loading) return <div>Loading...</div>;
  if (error || !data) return <div>Error</div>;

  return (
    <section className='mx-auto flex max-w-3xl flex-col items-center space-y-4'>
      <h1 className='text-center text-2xl font-semibold'>
        {t('qr.pageTitle')}
      </h1>

      <SePayQrCard {...data} />
    </section>
  );
}
