import { useTranslation } from 'react-i18next';
import { IconLoader2, IconRefresh } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';

interface VectorIngestionToolbarProps {
  types: string[];
  isIngestingAll: boolean;
  ingestingType: string | null;
  onIngestAll: () => void;
  onIngestByType: (type: string) => void;
}

export function VectorIngestionToolbar({
  types,
  isIngestingAll,
  ingestingType,
  onIngestAll,
  onIngestByType,
}: VectorIngestionToolbarProps) {
  const { t } = useTranslation();

  return (
    <div className='flex flex-wrap items-center gap-2'>
      <Button variant='default' onClick={onIngestAll} disabled={isIngestingAll}>
        {isIngestingAll ? (
          <IconLoader2 className='mr-2 h-4 w-4 animate-spin' />
        ) : (
          <IconRefresh className='mr-2 h-4 w-4' />
        )}
        {t('admin.ai.vector.ingestion.ingestAll', 'Ingest All')}
      </Button>

      {types.map((type) => (
        <Button
          key={type}
          variant='outline'
          onClick={() => onIngestByType(type)}
          disabled={ingestingType === type}
        >
          {ingestingType === type ? (
            <IconLoader2 className='mr-2 h-4 w-4 animate-spin' />
          ) : (
            <IconRefresh className='mr-2 h-4 w-4' />
          )}
          {t(`admin.ai.vector.ingestion.type.${type}`, type)}
        </Button>
      ))}
    </div>
  );
}
