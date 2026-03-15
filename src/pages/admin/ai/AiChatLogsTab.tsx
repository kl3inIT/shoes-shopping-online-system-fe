import { useState } from 'react';
import { Filter, ListChecks, MessagesSquare, Timer } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { getErrorMessage } from '@/features/apiClient';
import {
  ChatLogDetail,
  ChatLogFilterBar,
  ChatLogTable,
  type ChatLogSummary,
  useQueryChatLogs,
} from '@/features/admin/ai/chat-logs';
import {
  OperationsMetricCard,
  OperationsMetricGrid,
  OperationsSection,
} from './components/OperationsSection';

type DatePreset = 'today' | 'last7d' | 'last30d' | 'custom' | null;

const fromInstant = (dateStr: string) =>
  new Date(`${dateStr}T00:00:00.000Z`).toISOString();
const toInstant = (dateStr: string) =>
  new Date(`${dateStr}T23:59:59.999Z`).toISOString();

export function AiChatLogsTab() {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [conversationIdInput, setConversationIdInput] = useState('');
  const [appliedConversationId, setAppliedConversationId] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<DatePreset>(null);
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [appliedFrom, setAppliedFrom] = useState<string | undefined>(undefined);
  const [appliedTo, setAppliedTo] = useState<string | undefined>(undefined);
  const [detailLog, setDetailLog] = useState<ChatLogSummary | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const { data, isLoading, isError, error } = useQueryChatLogs({
    page,
    size: 20,
    conversationId: appliedConversationId || undefined,
    from: appliedFrom,
    to: appliedTo,
  });

  const logs = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;
  const averageLatencyMs =
    logs.length > 0
      ? Math.round(
          logs.reduce((sum, log) => sum + (log.responseTimeMs ?? 0), 0) /
            logs.length
        )
      : null;
  const activeFilterSummary =
    appliedConversationId || appliedFrom || appliedTo
      ? [
          appliedConversationId
            ? t('admin.ai.chatLogs.summary.conversationFilter', {
                defaultValue: 'Conversation ID applied',
              })
            : null,
          appliedFrom || appliedTo
            ? t('admin.ai.chatLogs.summary.dateFilter', {
                defaultValue: 'Date range applied',
              })
            : null,
        ]
          .filter(Boolean)
          .join(' • ')
      : t('admin.ai.chatLogs.summary.noFilter', {
          defaultValue: 'No filters applied',
        });

  const handleApplyConversationId = () => {
    setAppliedConversationId(conversationIdInput.trim());
    setPage(0);
  };

  const handleSelectPreset = (preset: DatePreset) => {
    setSelectedPreset(preset);
    setPage(0);

    if (preset === 'today') {
      const today = new Date().toISOString().slice(0, 10);
      setAppliedFrom(fromInstant(today));
      setAppliedTo(toInstant(today));
      return;
    }

    if (preset === 'last7d') {
      const to = new Date();
      const from = new Date(to);
      from.setDate(to.getDate() - 6);
      setAppliedFrom(fromInstant(from.toISOString().slice(0, 10)));
      setAppliedTo(toInstant(to.toISOString().slice(0, 10)));
      return;
    }

    if (preset === 'last30d') {
      const to = new Date();
      const from = new Date(to);
      from.setDate(to.getDate() - 29);
      setAppliedFrom(fromInstant(from.toISOString().slice(0, 10)));
      setAppliedTo(toInstant(to.toISOString().slice(0, 10)));
      return;
    }

    if (preset === 'custom') {
      setAppliedFrom(undefined);
      setAppliedTo(undefined);
    }
  };

  const handleApplyCustomRange = () => {
    if (!customFrom || !customTo) return;

    setAppliedFrom(fromInstant(customFrom));
    setAppliedTo(toInstant(customTo));
    setPage(0);
  };

  const handleClearAll = () => {
    setConversationIdInput('');
    setAppliedConversationId('');
    setSelectedPreset(null);
    setCustomFrom('');
    setCustomTo('');
    setAppliedFrom(undefined);
    setAppliedTo(undefined);
    setPage(0);
  };

  return (
    <div className='space-y-4'>
      <OperationsMetricGrid>
        <OperationsMetricCard
          label={t('admin.ai.chatLogs.summary.total', {
            defaultValue: 'Total logs',
          })}
          value={String(data?.totalElements ?? 0)}
          hint={t('admin.ai.chatLogs.summary.totalHint', {
            defaultValue:
              'Conversation responses captured for investigation and auditing.',
          })}
          icon={MessagesSquare}
        />
        <OperationsMetricCard
          label={t('admin.ai.chatLogs.summary.averageLatency', {
            defaultValue: 'Current page latency',
          })}
          value={
            averageLatencyMs !== null
              ? `${averageLatencyMs} ms`
              : t('admin.ai.chatLogs.summary.emptyMetric', {
                  defaultValue: 'N/A',
                })
          }
          hint={t('admin.ai.chatLogs.summary.averageLatencyHint', {
            defaultValue:
              'Useful for spotting slow responses before opening details.',
          })}
          icon={Timer}
        />
        <OperationsMetricCard
          label={t('admin.ai.chatLogs.summary.filters', {
            defaultValue: 'Filter state',
          })}
          value={activeFilterSummary}
          hint={t('admin.ai.chatLogs.summary.filtersHint', {
            defaultValue:
              'Keep the scope narrow when debugging a single conversation.',
          })}
          icon={Filter}
        />
      </OperationsMetricGrid>

      <OperationsSection
        title={t('admin.ai.chatLogs.section.title', {
          defaultValue: 'Conversation Logs',
        })}
        description={t('admin.ai.chatLogs.section.description', {
          defaultValue:
            'Start with a filter, scan the table for timing or token anomalies, then open the full conversation only when you need context.',
        })}
        contentClassName='space-y-4'
      >
        <ChatLogFilterBar
          conversationIdInput={conversationIdInput}
          onConversationIdChange={setConversationIdInput}
          onApplyConversationId={handleApplyConversationId}
          selectedPreset={selectedPreset}
          onSelectPreset={handleSelectPreset}
          customFrom={customFrom}
          customTo={customTo}
          onCustomFromChange={setCustomFrom}
          onCustomToChange={setCustomTo}
          onApplyCustomRange={handleApplyCustomRange}
          onClearAll={handleClearAll}
        />

        {!isLoading && !isError && data ? (
          <div className='flex items-center justify-between gap-3 rounded-xl border bg-muted/20 px-4 py-3 text-sm text-muted-foreground'>
            <span>
              {t('admin.ai.chatLogs.totalLogs', '{{count}} log(s) total', {
                count: data.totalElements,
              })}
            </span>
            <span className='flex items-center gap-2'>
              <ListChecks className='size-4' />
              {t(
                'admin.ai.chatLogs.pageSummary',
                'Showing {{count}} records on this page',
                { count: logs.length }
              )}
            </span>
          </div>
        ) : null}

        {isError ? (
          <div className='rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive'>
            {t('admin.ai.chatLogs.fetchError', 'Failed to load chat logs')}
            {': '}
            {getErrorMessage(error)}
          </div>
        ) : null}

        <ChatLogTable
          logs={logs}
          isLoading={isLoading}
          isError={isError}
          onViewDetail={(log) => {
            setDetailLog(log);
            setDetailOpen(true);
          }}
        />

        {totalPages > 0 ? (
          <Pagination className='justify-between'>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setPage((currentPage) => Math.max(0, currentPage - 1))
                  }
                  aria-disabled={data?.first}
                  className={
                    data?.first ? 'pointer-events-none opacity-50' : ''
                  }
                />
              </PaginationItem>
            </PaginationContent>
            <div className='px-4 text-sm text-muted-foreground'>
              {t(
                'admin.ai.chatLogs.pagination.pageOf',
                'Page {{page}} of {{total}}',
                {
                  page: (data?.number ?? 0) + 1,
                  total: totalPages,
                }
              )}
            </div>
            <PaginationContent>
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setPage((currentPage) =>
                      Math.min(totalPages - 1, currentPage + 1)
                    )
                  }
                  aria-disabled={data?.last}
                  className={data?.last ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        ) : null}
      </OperationsSection>

      <ChatLogDetail
        log={detailLog}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  );
}
