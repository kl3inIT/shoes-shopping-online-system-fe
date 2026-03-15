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
    <div className='space-y-2'>
      {/* ConversationId filter row */}
      <div className='flex items-center gap-2'>
        <Input
          className='max-w-xs'
          placeholder={t(
            'admin.ai.chatLogs.filter.conversationIdPlaceholder',
            'e.g. abc-123'
          )}
          value={conversationIdInput}
          onChange={(e) => onConversationIdChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onApplyConversationId()}
          aria-label={t(
            'admin.ai.chatLogs.filter.conversationId',
            'Conversation ID'
          )}
        />
        <Button variant='outline' size='sm' onClick={onApplyConversationId}>
          {t('admin.ai.chatLogs.filter.apply', 'Apply')}
        </Button>
        <Button variant='ghost' size='sm' onClick={onClearAll}>
          {t('admin.ai.chatLogs.filter.clearAll', 'Clear all')}
        </Button>
      </div>
      {/* Date preset bar */}
      <div className='flex items-center gap-2 flex-wrap'>
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
      {/* Custom date inputs — visible only when Custom is selected */}
      {selectedPreset === 'custom' && (
        <div className='flex items-center gap-2 flex-wrap'>
          <span className='text-sm text-muted-foreground'>
            {t('admin.ai.chatLogs.filter.customFrom', 'From')}
          </span>
          <Input
            type='date'
            className='w-40'
            value={customFrom}
            onChange={(e) => onCustomFromChange(e.target.value)}
          />
          <span className='text-sm text-muted-foreground'>
            {t('admin.ai.chatLogs.filter.customTo', 'To')}
          </span>
          <Input
            type='date'
            className='w-40'
            value={customTo}
            onChange={(e) => onCustomToChange(e.target.value)}
          />
          <Button
            variant='outline'
            size='sm'
            onClick={onApplyCustomRange}
            disabled={!customFrom || !customTo}
          >
            {t('admin.ai.chatLogs.filter.apply', 'Apply')}
          </Button>
        </div>
      )}
    </div>
  );
}
