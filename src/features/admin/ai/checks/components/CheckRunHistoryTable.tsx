import { IconEye, IconTrash } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import { Badge } from '@/components/ui/badge';
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

function ScoreBadge({ score }: { score: number | null }) {
  if (score === null) {
    return <span className='text-muted-foreground'>N/A</span>;
  }

  return (
    <Badge
      className={
        score >= 0.7
          ? 'border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50'
          : 'border border-red-200 bg-red-50 text-red-700 hover:bg-red-50'
      }
    >
      {score.toFixed(2)}
    </Badge>
  );
}

export function CheckRunHistoryTable({
  runs,
  isLoading,
  onDelete,
}: CheckRunHistoryTableProps) {
  const { t } = useTranslation();

  return (
    <div className='overflow-hidden rounded-2xl border border-border/70'>
      <Table className='table-fixed min-w-[860px]'>
        <TableHeader className='bg-muted/30'>
          <TableRow>
            <TableHead className='w-[18%] px-4 py-3'>
              {t('admin.ai.checks.table.runs.score', 'Score')}
            </TableHead>
            <TableHead className='w-[34%] px-4 py-3'>
              {t('admin.ai.checks.table.runs.date', 'Date')}
            </TableHead>
            <TableHead className='w-[22%] px-4 py-3'>
              {t('admin.ai.checks.table.runs.by', 'By')}
            </TableHead>
            <TableHead className='w-[26%] px-4 py-3 text-right'>
              {t('admin.ai.checks.table.runs.actions', 'Actions')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            ['skeleton-1', 'skeleton-2', 'skeleton-3'].map((key) => (
              <TableRow key={key}>
                <TableCell colSpan={4}>
                  <div className='h-4 animate-pulse rounded bg-muted' />
                </TableCell>
              </TableRow>
            ))
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
                <TableCell className='px-4 py-4 align-top'>
                  <ScoreBadge score={run.score} />
                </TableCell>
                <TableCell className='px-4 py-4 align-top whitespace-normal text-sm text-muted-foreground'>
                  {run.createdAt
                    ? new Date(run.createdAt).toLocaleString()
                    : 'N/A'}
                </TableCell>
                <TableCell className='px-4 py-4 align-top whitespace-normal text-sm'>
                  {run.createdByUsername ?? run.createdBy ?? 'N/A'}
                </TableCell>
                <TableCell className='px-4 py-4 align-top text-right'>
                  <div className='flex items-center justify-end gap-2'>
                    <Button
                      variant='outline'
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
