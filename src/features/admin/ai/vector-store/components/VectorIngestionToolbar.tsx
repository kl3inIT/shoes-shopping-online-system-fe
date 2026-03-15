import { IconChevronDown, IconLoader2, IconRefresh } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

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
    <div className='flex flex-col gap-3 rounded-2xl border border-border/70 bg-background p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between'>
      <div className='space-y-1'>
        <p className='text-sm font-medium'>
          {t('admin.ai.vector.ingestion.title', {
            defaultValue: 'Run ingestion jobs',
          })}
        </p>
        <p className='text-sm text-muted-foreground'>
          {t('admin.ai.vector.ingestion.description', {
            defaultValue:
              'Use a full ingest for broad refreshes, or target a single source type when only one pipeline changed.',
          })}
        </p>
      </div>

      <div className='flex flex-wrap items-center gap-2'>
        <Button variant='default' onClick={onIngestAll} disabled={isAnyRunning}>
          {isIngestingAll ? (
            <IconLoader2 className='mr-2 h-4 w-4 animate-spin' />
          ) : (
            <IconRefresh className='mr-2 h-4 w-4' />
          )}
          {isIngestingAll
            ? t('admin.ai.vector.ingestion.runningAll', {
                defaultValue: 'Running full ingest...',
              })
            : t('admin.ai.vector.ingestion.ingestAll', 'Ingest All')}
        </Button>

        {types.length > 0 ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' disabled={isAnyRunning}>
                {ingestingType !== null ? (
                  <IconLoader2 className='mr-2 h-4 w-4 animate-spin' />
                ) : (
                  <IconRefresh className='mr-2 h-4 w-4' />
                )}
                {ingestingType !== null
                  ? t(
                      'admin.ai.vector.ingestion.running',
                      'Running {{type}}...',
                      {
                        type: ingestingType,
                      }
                    )
                  : t('admin.ai.vector.ingestion.runByType', 'Run by type')}
                <IconChevronDown className='ml-2 h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
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
        ) : null}
      </div>
    </div>
  );
}
