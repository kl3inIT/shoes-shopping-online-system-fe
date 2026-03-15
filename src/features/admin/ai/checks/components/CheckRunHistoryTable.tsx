import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
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
}

export function CheckRunHistoryTable({
  runs,
  isLoading,
}: CheckRunHistoryTableProps) {
  const { t } = useTranslation();

  return (
    <div className='rounded-lg border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              {t('admin.ai.checks.table.runs.score', 'Score')}
            </TableHead>
            <TableHead>
              {t('admin.ai.checks.table.runs.date', 'Date')}
            </TableHead>
            <TableHead>{t('admin.ai.checks.table.runs.by', 'By')}</TableHead>
            <TableHead className='text-right'>
              {t('admin.ai.checks.table.runs.actions', 'Actions')}
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
                {t('admin.ai.checks.table.runs.empty', 'No check runs yet')}
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
                  <Button variant='ghost' size='sm' className='gap-1.5' asChild>
                    <Link
                      to={`/admin/ai/checks/runs/${run.id}`}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <IconEye className='h-4 w-4' />
                      {t('admin.ai.checks.button.viewResults', 'View Results')}
                    </Link>
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
