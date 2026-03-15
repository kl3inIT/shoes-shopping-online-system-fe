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
    <div className='space-y-1'>
      <div className='flex items-center gap-2'>
        <Input
          className='max-w-sm'
          placeholder={t(
            'admin.ai.vector.filterPlaceholder',
            '{"docType": "product"}'
          )}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onApply();
            }
          }}
        />
        <Button variant='default' onClick={onApply}>
          {t('admin.ai.vector.filter.apply', 'Apply')}
        </Button>
        {value && (
          <Button variant='outline' onClick={onClear}>
            {t('admin.ai.vector.filter.clear', 'Clear')}
          </Button>
        )}
      </div>
      {error && <p className='text-sm text-destructive'>{error}</p>}
    </div>
  );
}
