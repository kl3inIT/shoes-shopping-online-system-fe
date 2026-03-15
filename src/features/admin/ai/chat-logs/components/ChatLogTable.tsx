import { useTranslation } from 'react-i18next';
import { IconEye } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { ChatLogSummary } from '../types';

interface ChatLogTableProps {
  logs: ChatLogSummary[];
  isLoading: boolean;
  isError?: boolean;
  onViewDetail: (log: ChatLogSummary) => void;
}

export function ChatLogTable({
  logs,
  isLoading,
  isError = false,
  onViewDetail,
}: ChatLogTableProps) {
  const { t } = useTranslation();

  return (
    <div className='rounded-lg border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('admin.ai.chatLogs.table.date', 'Date')}</TableHead>
            <TableHead>
              {t('admin.ai.chatLogs.table.conversationId', 'Conversation ID')}
            </TableHead>
            <TableHead className='text-right'>
              {t('admin.ai.chatLogs.table.promptTokens', 'Prompt Tokens')}
            </TableHead>
            <TableHead className='text-right'>
              {t(
                'admin.ai.chatLogs.table.completionTokens',
                'Completion Tokens'
              )}
            </TableHead>
            <TableHead className='text-right'>
              {t('admin.ai.chatLogs.table.responseTime', 'Response Time (ms)')}
            </TableHead>
            <TableHead>
              {t('admin.ai.chatLogs.table.content', 'Content')}
            </TableHead>
            <TableHead className='text-right'>
              {t('admin.ai.chatLogs.table.actions', 'Actions')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && logs.length === 0 ? (
            <>
              {[0, 1, 2].map((i) => (
                <TableRow key={i}>
                  <TableCell colSpan={7}>
                    <div className='h-4 animate-pulse rounded bg-muted' />
                  </TableCell>
                </TableRow>
              ))}
            </>
          ) : isError ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className='py-12 text-center text-muted-foreground'
              >
                {t(
                  'admin.ai.chatLogs.table.errorState',
                  'Could not load chat logs'
                )}
              </TableCell>
            </TableRow>
          ) : logs.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className='py-12 text-center text-muted-foreground'
              >
                {t('common.noData', 'No logs found')}
              </TableCell>
            </TableRow>
          ) : (
            logs.map((log) => (
              <TableRow
                key={log.id}
                className='cursor-pointer hover:bg-muted/50'
                onClick={() => onViewDetail(log)}
              >
                <TableCell className='text-sm text-muted-foreground whitespace-nowrap'>
                  {log.createdAt
                    ? new Date(log.createdAt).toLocaleString()
                    : '—'}
                </TableCell>
                <TableCell className='font-mono text-xs'>
                  {log.conversationId ?? '—'}
                </TableCell>
                <TableCell className='text-right text-sm'>
                  {log.promptTokens ?? '—'}
                </TableCell>
                <TableCell className='text-right text-sm'>
                  {log.completionTokens ?? '—'}
                </TableCell>
                <TableCell className='text-right text-sm'>
                  {log.responseTimeMs ?? '—'}
                </TableCell>
                <TableCell className='max-w-xs text-sm text-muted-foreground'>
                  {log.contentExcerpt
                    ? log.contentExcerpt.substring(0, 60) +
                      (log.contentExcerpt.length > 60 ? '…' : '')
                    : '—'}
                </TableCell>
                <TableCell className='text-right'>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-8 w-8'
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDetail(log);
                    }}
                  >
                    <IconEye className='h-4 w-4' />
                    <span className='sr-only'>
                      {t('admin.ai.chatLogs.actions.viewDetail', 'View detail')}
                    </span>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
