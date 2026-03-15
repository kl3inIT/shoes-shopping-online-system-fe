import { useState } from 'react';
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
  ChatLogTable,
  ChatLogDetail,
  ChatLogFilterBar,
  useQueryChatLogs,
  type ChatLogSummary,
} from '@/features/admin/ai/chat-logs';

type DatePreset = 'today' | 'last7d' | 'last30d' | 'custom' | null;

const fromInstant = (dateStr: string) =>
  new Date(dateStr + 'T00:00:00.000Z').toISOString();
const toInstant = (dateStr: string) =>
  new Date(dateStr + 'T23:59:59.999Z').toISOString();

export function AiChatLogsTab() {
  const { t } = useTranslation();

  // Pagination state
  const [page, setPage] = useState(0);

  // ConversationId filter state
  const [conversationIdInput, setConversationIdInput] = useState('');
  const [appliedConversationId, setAppliedConversationId] = useState('');

  // Date preset + custom range state
  const [selectedPreset, setSelectedPreset] = useState<DatePreset>(null);
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [appliedFrom, setAppliedFrom] = useState<string | undefined>(undefined);
  const [appliedTo, setAppliedTo] = useState<string | undefined>(undefined);

  // Detail dialog state
  const [detailLog, setDetailLog] = useState<ChatLogSummary | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // Query
  const { data, isLoading, isError, error } = useQueryChatLogs({
    page,
    size: 20,
    conversationId: appliedConversationId || undefined,
    from: appliedFrom,
    to: appliedTo,
  });

  const logs = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;

  // ConversationId apply handler
  const handleApplyConversationId = () => {
    setAppliedConversationId(conversationIdInput);
    setPage(0);
  };

  // Date preset handlers
  const handleSelectPreset = (preset: DatePreset) => {
    setSelectedPreset(preset);
    setPage(0);
    if (preset === 'today') {
      const today = new Date().toISOString().slice(0, 10);
      setAppliedFrom(fromInstant(today));
      setAppliedTo(toInstant(today));
    } else if (preset === 'last7d') {
      const to = new Date();
      const from = new Date(to);
      from.setDate(to.getDate() - 6);
      setAppliedFrom(fromInstant(from.toISOString().slice(0, 10)));
      setAppliedTo(toInstant(to.toISOString().slice(0, 10)));
    } else if (preset === 'last30d') {
      const to = new Date();
      const from = new Date(to);
      from.setDate(to.getDate() - 29);
      setAppliedFrom(fromInstant(from.toISOString().slice(0, 10)));
      setAppliedTo(toInstant(to.toISOString().slice(0, 10)));
    } else if (preset === 'custom') {
      // Do NOT apply range yet — wait for Apply click
      setAppliedFrom(undefined);
      setAppliedTo(undefined);
    }
  };

  const handleApplyCustomRange = () => {
    if (!customFrom || !customTo) return; // guard — button is also disabled
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
      {/* Log count summary — hidden while loading or error */}
      {!isLoading && !isError && data && (
        <p className='text-sm text-muted-foreground'>
          {t('admin.ai.chatLogs.totalLogs', '{{count}} log(s) total', {
            count: data.totalElements,
          })}
        </p>
      )}
      {/* Fetch error banner */}
      {isError && (
        <div className='rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive'>
          {t('admin.ai.chatLogs.fetchError', 'Failed to load chat logs')}
          {': '}
          {getErrorMessage(error)}
        </div>
      )}
      <ChatLogTable
        logs={logs}
        isLoading={isLoading}
        isError={isError}
        onViewDetail={(log) => {
          setDetailLog(log);
          setDetailOpen(true);
        }}
      />
      {/* Pagination */}
      {totalPages > 0 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                aria-disabled={data?.first}
                className={data?.first ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
            <PaginationItem>
              <span className='px-4 text-sm text-muted-foreground select-none'>
                {t(
                  'admin.ai.chatLogs.pagination.pageOf',
                  'Page {{page}} of {{total}}',
                  {
                    page: (data?.number ?? 0) + 1,
                    total: totalPages,
                  }
                )}
              </span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                aria-disabled={data?.last}
                className={data?.last ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
      <ChatLogDetail
        log={detailLog}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  );
}
