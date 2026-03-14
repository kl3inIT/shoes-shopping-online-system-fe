import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function AiTestChatTab() {
  const { t } = useTranslation();

  return (
    <div className='grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]'>
      <Card className='h-[520px]'>
        <CardHeader>
          <CardTitle>{t('admin.ai.testChat.title', 'Test Chat')}</CardTitle>
        </CardHeader>
        <CardContent className='h-[440px]'>
          <p className='mb-2 text-sm text-muted-foreground'>
            {t(
              'admin.ai.testChat.description',
              'Dùng widget chat nổi ở frontend để test thực tế. Sau này bạn có thể nhúng một phiên bản chat chuyên cho admin vào đây.'
            )}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>
            {t('admin.ai.testChat.previewTitle', 'Live Preview')}
          </CardTitle>
        </CardHeader>
        <CardContent className='relative h-[440px]'>
          <div className='pointer-events-none absolute inset-0 flex items-center justify-center rounded-lg border border-dashed'>
            <span className='text-xs text-muted-foreground'>
              {t(
                'admin.ai.testChat.previewHint',
                'Preview khu vực chat của người dùng (tham khảo FloatingChat)'
              )}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
