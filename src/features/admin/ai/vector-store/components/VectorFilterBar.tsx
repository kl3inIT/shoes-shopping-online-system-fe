import { Filter } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface VectorFilterBarProps {
  value: string;
  onChange: (v: string) => void;
  onApply: () => void;
  onClear: () => void;
  error: string | null;
}

export function VectorFilterBar({
  value,
  onChange,
  onApply,
  onClear,
  error,
}: VectorFilterBarProps) {
  const { t } = useTranslation();

  return (
    <div className='rounded-2xl border border-border/70 bg-background p-4 shadow-sm'>
      <div className='mb-3 flex items-center gap-2 text-sm font-medium'>
        <Filter className='size-4 text-muted-foreground' />
        {t('admin.ai.vector.filter.title', {
          defaultValue: 'Metadata filter',
        })}
      </div>
      <div className='space-y-2'>
        <p className='text-sm text-muted-foreground'>
          {t('admin.ai.vector.filter.description', {
            defaultValue:
              'Use a JSON object to narrow documents before reviewing or deleting them.',
          })}
        </p>
        <div className='flex flex-col gap-3 sm:flex-row'>
          <Input
            className='flex-1 font-mono text-sm'
            placeholder={t(
              'admin.ai.vector.filterPlaceholder',
              '{"docType":"product","locale":"vi"}'
            )}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onApply();
              }
            }}
          />
          <div className='flex gap-2'>
            <Button variant='default' onClick={onApply}>
              {t('admin.ai.vector.filter.apply', 'Apply')}
            </Button>
            {value ? (
              <Button variant='outline' onClick={onClear}>
                {t('admin.ai.vector.filter.clear', 'Clear')}
              </Button>
            ) : null}
          </div>
        </div>
        {error ? <p className='text-sm text-destructive'>{error}</p> : null}
      </div>
    </div>
  );
}
