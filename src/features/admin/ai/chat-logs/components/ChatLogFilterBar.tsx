import { CalendarRange, Search, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type DatePreset = 'today' | 'last7d' | 'last30d' | 'custom' | null;

export interface ChatLogFilterBarProps {
  conversationIdInput: string;
  onConversationIdChange: (val: string) => void;
  onApplyConversationId: () => void;
  selectedPreset: DatePreset;
  onSelectPreset: (preset: DatePreset) => void;
  customFrom: string;
  customTo: string;
  onCustomFromChange: (val: string) => void;
  onCustomToChange: (val: string) => void;
  onApplyCustomRange: () => void;
  onClearAll: () => void;
}

export function ChatLogFilterBar({
  conversationIdInput,
  onConversationIdChange,
  onApplyConversationId,
  selectedPreset,
  onSelectPreset,
  customFrom,
  customTo,
  onCustomFromChange,
  onCustomToChange,
  onApplyCustomRange,
  onClearAll,
}: ChatLogFilterBarProps) {
  const { t } = useTranslation();
  const presets: { key: Exclude<DatePreset, null>; label: string }[] = [
    {
      key: 'today',
      label: t('admin.ai.chatLogs.filter.datePreset.today', 'Today'),
    },
    {
      key: 'last7d',
      label: t('admin.ai.chatLogs.filter.datePreset.last7d', 'Last 7 days'),
    },
    {
      key: 'last30d',
      label: t('admin.ai.chatLogs.filter.datePreset.last30d', 'Last 30 days'),
    },
    {
      key: 'custom',
      label: t('admin.ai.chatLogs.filter.datePreset.custom', 'Custom'),
    },
  ];

  return (
    <div className='grid gap-3 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]'>
      <div className='rounded-2xl border border-border/70 bg-background p-4 shadow-sm'>
        <div className='mb-3 flex items-center gap-2 text-sm font-medium'>
          <Search className='size-4 text-muted-foreground' />
          {t('admin.ai.chatLogs.filter.conversationId', 'Conversation ID')}
        </div>
        <div className='flex flex-col gap-3 sm:flex-row'>
          <Input
            className='flex-1'
            placeholder={t(
              'admin.ai.chatLogs.filter.conversationIdPlaceholder',
              'Enter a full or partial conversation identifier'
            )}
            value={conversationIdInput}
            onChange={(e) => onConversationIdChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onApplyConversationId()}
            aria-label={t(
              'admin.ai.chatLogs.filter.conversationId',
              'Conversation ID'
            )}
          />
          <div className='flex gap-2'>
            <Button variant='outline' onClick={onApplyConversationId}>
              {t('admin.ai.chatLogs.filter.apply', 'Apply')}
            </Button>
            <Button variant='ghost' onClick={onClearAll}>
              <X className='size-4' />
              {t('admin.ai.chatLogs.filter.clearAll', 'Clear all')}
            </Button>
          </div>
        </div>
      </div>

      <div className='rounded-2xl border border-border/70 bg-background p-4 shadow-sm'>
        <div className='mb-3 flex items-center gap-2 text-sm font-medium'>
          <CalendarRange className='size-4 text-muted-foreground' />
          {t('admin.ai.chatLogs.filter.datePreset.custom', 'Date range')}
        </div>
        <div className='flex flex-wrap gap-2'>
          {presets.map(({ key, label }) => (
            <Button
              key={key}
              variant={selectedPreset === key ? 'default' : 'outline'}
              size='sm'
              onClick={() => onSelectPreset(key)}
            >
              {label}
            </Button>
          ))}
        </div>
        {selectedPreset === 'custom' ? (
          <div className='mt-3 flex flex-col gap-3 sm:flex-row sm:items-end'>
            <div className='flex-1 space-y-2'>
              <label className='text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase'>
                {t('admin.ai.chatLogs.filter.customFrom', 'From')}
              </label>
              <Input
                type='date'
                value={customFrom}
                onChange={(e) => onCustomFromChange(e.target.value)}
              />
            </div>
            <div className='flex-1 space-y-2'>
              <label className='text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase'>
                {t('admin.ai.chatLogs.filter.customTo', 'To')}
              </label>
              <Input
                type='date'
                value={customTo}
                onChange={(e) => onCustomToChange(e.target.value)}
              />
            </div>
            <Button
              variant='outline'
              onClick={onApplyCustomRange}
              disabled={!customFrom || !customTo}
            >
              {t('admin.ai.chatLogs.filter.apply', 'Apply')}
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
