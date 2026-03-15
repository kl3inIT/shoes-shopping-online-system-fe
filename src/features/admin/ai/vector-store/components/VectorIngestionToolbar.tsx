import { useTranslation } from 'react-i18next';
import { IconLoader2, IconRefresh, IconChevronDown } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
  const isAnyRunning = isIngestingAll || ingestingType !== null;

  return (
    <div className='flex items-center gap-2'>
      <Button variant='default' onClick={onIngestAll} disabled={isIngestingAll}>
        {isIngestingAll ? (
          <IconLoader2 className='mr-2 h-4 w-4 animate-spin' />
        ) : (
          <IconRefresh className='mr-2 h-4 w-4' />
        )}
        {t('admin.ai.vector.ingestion.ingestAll', 'Ingest All')}
      </Button>

      {types.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' disabled={isAnyRunning}>
              {ingestingType !== null ? (
                <IconLoader2 className='mr-2 h-4 w-4 animate-spin' />
              ) : (
                <IconRefresh className='mr-2 h-4 w-4' />
              )}
              {ingestingType !== null
                ? t('admin.ai.vector.ingestion.running', 'Running {{type}}…', {
                    type: ingestingType,
                  })
                : t('admin.ai.vector.ingestion.runByType', 'Run by type')}
              <IconChevronDown className='ml-2 h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='start'>
            {types.map((type) => (
              <DropdownMenuItem
                key={type}
                onSelect={() => onIngestByType(type)}
                disabled={isAnyRunning}
              >
                {t(`admin.ai.vector.ingestion.type.${type}`, type)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
