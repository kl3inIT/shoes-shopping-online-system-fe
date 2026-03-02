import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function AiVectorStoreTab() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('admin.ai.vector.title', 'Vector Store')}</CardTitle>
      </CardHeader>
      <CardContent className='space-y-3'>
        <p className='text-sm text-muted-foreground'>
          {t(
            'admin.ai.vector.description',
            'Trang này sẽ hiển thị thống kê số document theo docType (policy, product, order, review, ...) và trạng thái ingestion.'
          )}
        </p>
      </CardContent>
    </Card>
  );
}
