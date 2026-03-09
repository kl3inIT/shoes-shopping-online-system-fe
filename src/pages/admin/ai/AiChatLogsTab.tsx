import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function AiChatLogsTab() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('admin.ai.chatLogs.title', 'Chat Logs')}</CardTitle>
      </CardHeader>
      <CardContent className='space-y-3'>
        <p className='text-sm text-muted-foreground'>
          {t(
            'admin.ai.chatLogs.description',
            'Sau này sẽ có bảng hiển thị conversation gần đây, filter theo user / thời gian / score, và xem chi tiết từng phiên chat.'
          )}
        </p>
      </CardContent>
    </Card>
  );
}
