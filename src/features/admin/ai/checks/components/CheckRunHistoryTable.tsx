import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { IconEye, IconTrash } from '@tabler/icons-react';
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
  onDelete: (id: string) => void;
}

export function CheckRunHistoryTable({
  runs,
  isLoading,
  onDelete,
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
                  <TableCell colSpan={3}>
                    <div className='h-4 animate-pulse rounded bg-muted' />
                  </TableCell>
                </TableRow>
              ))}
            </>
          ) : runs.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={3}
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
                <TableCell className='text-right'>
                  <div className='flex items-center justify-end gap-1'>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='gap-1.5'
                      asChild
                    >
                      <Link to={`/admin/ai/checks/runs/${run.id}`}>
                        <IconEye className='h-4 w-4' />
                        {t(
                          'admin.ai.checks.button.viewResults',
                          'View Results'
                        )}
                      </Link>
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-8 w-8 text-destructive hover:text-destructive'
                      onClick={() => onDelete(run.id)}
                    >
                      <IconTrash className='h-4 w-4' />
                      <span className='sr-only'>
                        {t('admin.ai.checks.table.runs.delete', 'Delete')}
                      </span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
