import { useTranslation } from 'react-i18next';
import { IconLoader2 } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useQueryChatLog } from '../hooks';
import type { ChatLogSummary } from '../types';

interface ChatLogDetailProps {
  log: ChatLogSummary | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChatLogDetail({ log, open, onOpenChange }: ChatLogDetailProps) {
  const { t } = useTranslation();
  const { data, isLoading } = useQueryChatLog(log?.id ?? '');

  if (!log) return null;

  const sources = data?.sources
    ? data.sources
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl max-h-[85vh] flex flex-col'>
        <DialogHeader>
          <DialogTitle>
            {t('admin.ai.chatLogs.detail.title', 'Chat Log Detail')}
          </DialogTitle>
          <p className='text-sm text-muted-foreground font-mono'>
            {log.conversationId ?? '—'} &middot;{' '}
            {log.createdAt ? new Date(log.createdAt).toLocaleString() : ''}
          </p>
        </DialogHeader>
        {isLoading ? (
          <div className='flex flex-1 items-center justify-center py-12'>
            <IconLoader2 className='h-6 w-6 animate-spin text-muted-foreground' />
          </div>
        ) : (
          <div className='flex-1 overflow-y-auto space-y-4 pr-1'>
            {/* Response section */}
            <div>
              <h3 className='mb-1 text-sm font-semibold'>
                {t('admin.ai.chatLogs.detail.response', 'Response')}
              </h3>
              <div className='rounded-md border bg-muted/30 p-3 text-sm whitespace-pre-wrap overflow-y-auto max-h-48'>
                {data?.logContent ?? '—'}
              </div>
            </div>
            {/* Sources section — hidden when empty */}
            {sources.length > 0 && (
              <div>
                <h3 className='mb-1 text-sm font-semibold'>
                  {t('admin.ai.chatLogs.detail.sources', 'Sources')}
                </h3>
                <ul className='list-disc list-inside space-y-1'>
                  {sources.map((src, i) => (
                    <li
                      key={i}
                      className='text-sm text-muted-foreground break-all'
                    >
                      {src}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {/* Metadata row */}
            <div className='flex flex-wrap gap-6 text-sm'>
              <span>
                <span className='font-medium'>
                  {t('admin.ai.chatLogs.detail.promptTokens', 'Prompt tokens')}
                  :{' '}
                </span>
                {data?.promptTokens ?? '—'}
              </span>
              <span>
                <span className='font-medium'>
                  {t(
                    'admin.ai.chatLogs.detail.completionTokens',
                    'Completion tokens'
                  )}
                  :{' '}
                </span>
                {data?.completionTokens ?? '—'}
              </span>
              <span>
                <span className='font-medium'>
                  {t('admin.ai.chatLogs.detail.responseTime', 'Response time')}
                  :{' '}
                </span>
                {data?.responseTimeMs != null
                  ? `${data.responseTimeMs.toLocaleString()} ms`
                  : '—'}
              </span>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            {t('admin.ai.chatLogs.detail.close', 'Close')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
