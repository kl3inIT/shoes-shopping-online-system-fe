import { useTranslation } from 'react-i18next';
import { FeaturePlaceholder } from '@/components/app';

export default function AdminReviewsPage() {
  const { t } = useTranslation();

  return (
    <div className='flex flex-col gap-4 py-4'>
      <div className='flex items-center justify-between px-4 lg:px-6'>
        <div>
          <h1 className='text-2xl font-bold'>{t('admin.reviews.title')}</h1>
          <p className='text-muted-foreground'>
            {t('admin.reviews.subtitle', { count: 0 })}
          </p>
        </div>
      </div>

      <div className='px-4 lg:px-6'>
        <FeaturePlaceholder
          title='Review moderation still needs backend wiring'
          description='This page previously moderated in-memory sample reviews. It now acts as an integration placeholder until review queues and moderation endpoints are confirmed.'
          items={[
            'Add review queue query hooks with pagination and moderation filters.',
            'Connect approve and reject mutations to backend audit-safe endpoints.',
            'Define which review details are safe to expose in admin tooling.',
          ]}
        />
      </div>
    </div>
  );
}
