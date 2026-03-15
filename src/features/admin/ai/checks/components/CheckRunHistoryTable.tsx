import { useTranslation } from 'react-i18next';
import { IconEye } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { CheckRunSummaryResponse } from '../types';

interface CheckRunHistoryTableProps {
  runs: CheckRunSummaryResponse[];
  isLoading: boolean;
  onViewResults: (runId: string) => void;
}

export function CheckRunHistoryTable({
  runs,
  isLoading,
  onViewResults,
}: CheckRunHistoryTableProps) {
  const { t } = useTranslation();

  return (
    <div className='rounded-lg border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              {t('admin.ai.checks.runs.table.score', 'Score')}
            </TableHead>
            <TableHead>
              {t('admin.ai.checks.runs.table.date', 'Date')}
            </TableHead>
            <TableHead>{t('admin.ai.checks.runs.table.by', 'By')}</TableHead>
            <TableHead className='text-right'>
              {t('admin.ai.checks.runs.table.actions', 'Actions')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <>
              {[0, 1, 2].map((i) => (
                <TableRow key={i}>
                  <TableCell colSpan={4}>
                    <div className='h-4 animate-pulse rounded bg-muted' />
                  </TableCell>
                </TableRow>
              ))}
            </>
          ) : runs.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className='py-12 text-center text-muted-foreground'
              >
                {t(
                  'admin.ai.checks.runs.table.emptyState',
                  'No check runs yet'
                )}
              </TableCell>
            </TableRow>
          ) : (
            runs.map((run) => (
              <TableRow key={run.id}>
                <TableCell className='text-sm font-medium'>
                  {run.score !== null ? run.score.toFixed(2) : '—'}
                </TableCell>
                <TableCell className='text-sm text-muted-foreground whitespace-nowrap'>
                  {run.createdAt
                    ? new Date(run.createdAt).toLocaleString()
                    : '—'}
                </TableCell>
                <TableCell className='text-sm text-muted-foreground'>
                  {run.createdByUsername ?? '—'}
                </TableCell>
                <TableCell className='text-right'>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='gap-1.5'
                    onClick={() => onViewResults(run.id)}
                  >
                    <IconEye className='h-4 w-4' />
                    {t(
                      'admin.ai.checks.runs.table.viewResults',
                      'View Results'
                    )}
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
