import { useTranslation } from 'react-i18next';

export function StaticPage() {
  const { t } = useTranslation();

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-2xl font-semibold'>{t('static.title', 'Static')}</h1>
      <p className='mt-2 text-muted-foreground'>
        {t('static.description', 'This is a placeholder static page.')}
      </p>
    </div>
  );
}

export default StaticPage;
