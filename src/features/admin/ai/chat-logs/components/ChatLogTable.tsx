import { IconEye } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

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

function formatExcerpt(text: string | null) {
  if (!text) {
    return null;
  }

  const normalizedText = text.replace(/\s+/g, ' ').trim();

  if (normalizedText.length <= 110) {
    return normalizedText;
  }

  return `${normalizedText.slice(0, 110).trimEnd()}...`;
}

export function ChatLogTable({
  logs,
  isLoading,
  isError = false,
  onViewDetail,
}: ChatLogTableProps) {
  const { t } = useTranslation();

  return (
    <div className='overflow-hidden rounded-2xl border border-border/70'>
      <Table className='table-fixed min-w-[980px]'>
        <TableHeader className='bg-muted/30'>
          <TableRow>
            <TableHead className='w-[16%] px-4 py-3'>
              {t('admin.ai.chatLogs.table.date', 'Date')}
            </TableHead>
            <TableHead className='w-[22%] px-4 py-3'>
              {t('admin.ai.chatLogs.table.conversationId', 'Conversation ID')}
            </TableHead>
            <TableHead className='w-[10%] px-4 py-3 text-right'>
              {t('admin.ai.chatLogs.table.promptTokens', 'Prompt Tokens')}
            </TableHead>
            <TableHead className='w-[10%] px-4 py-3 text-right'>
              {t(
                'admin.ai.chatLogs.table.completionTokens',
                'Completion Tokens'
              )}
            </TableHead>
            <TableHead className='w-[10%] px-4 py-3 text-right'>
              {t('admin.ai.chatLogs.table.responseTime', 'Response Time (ms)')}
            </TableHead>
            <TableHead className='w-[22%] px-4 py-3'>
              {t('admin.ai.chatLogs.table.content', 'Content')}
            </TableHead>
            <TableHead className='w-[10%] px-4 py-3 text-right'>
              {t('admin.ai.chatLogs.table.actions', 'Actions')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && logs.length === 0 ? (
            ['skeleton-1', 'skeleton-2', 'skeleton-3'].map((key) => (
              <TableRow key={key}>
                <TableCell colSpan={7}>
                  <div className='h-4 animate-pulse rounded bg-muted' />
                </TableCell>
              </TableRow>
            ))
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
                className='cursor-pointer'
                onClick={() => onViewDetail(log)}
              >
                <TableCell className='px-4 py-4 align-top whitespace-normal text-sm text-muted-foreground'>
                  {log.createdAt
                    ? new Date(log.createdAt).toLocaleString()
                    : 'N/A'}
                </TableCell>
                <TableCell className='break-all px-4 py-4 align-top font-mono text-xs text-muted-foreground whitespace-normal'>
                  {log.conversationId ?? 'N/A'}
                </TableCell>
                <TableCell className='px-4 py-4 text-right align-top text-sm'>
                  {log.promptTokens ?? 'N/A'}
                </TableCell>
                <TableCell className='px-4 py-4 text-right align-top text-sm'>
                  {log.completionTokens ?? 'N/A'}
                </TableCell>
                <TableCell className='px-4 py-4 text-right align-top text-sm'>
                  {log.responseTimeMs ?? 'N/A'}
                </TableCell>
                <TableCell className='px-4 py-4 align-top whitespace-normal'>
                  <p className='line-clamp-3 break-words text-sm leading-6 text-muted-foreground'>
                    {formatExcerpt(log.contentExcerpt) ?? 'N/A'}
                  </p>
                </TableCell>
                <TableCell className='px-4 py-4 text-right align-top'>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='gap-1.5'
                    onClick={(event) => {
                      event.stopPropagation();
                      onViewDetail(log);
                    }}
                  >
                    <IconEye className='h-4 w-4' />
                    {t('admin.ai.chatLogs.actions.viewDetail', 'View detail')}
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
