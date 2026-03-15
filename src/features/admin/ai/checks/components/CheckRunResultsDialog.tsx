import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useQueryCheckResults } from '../hooks';

interface CheckRunResultsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  runId: string | null;
  runScore: number | null;
  runDate: string | null;
}

function VerdictBadge({ score }: { score: number | null }) {
  const { t } = useTranslation();
  if (score === null) return <span className='text-muted-foreground'>—</span>;
  if (score >= 0.7) {
    return (
      <Badge className='bg-green-100 text-green-800 hover:bg-green-100'>
        {t('admin.ai.checks.verdict.pass', 'PASS')}
      </Badge>
    );
  }
  return (
    <Badge className='bg-red-100 text-red-800 hover:bg-red-100'>
      {t('admin.ai.checks.verdict.fail', 'FAIL')}
    </Badge>
  );
}

export function CheckRunResultsDialog({
  open,
  onOpenChange,
  runId,
  runScore,
  runDate,
}: CheckRunResultsDialogProps) {
  const { t } = useTranslation();
  const { data: results, isLoading } = useQueryCheckResults(
    open ? runId : null
  );

  const formattedDate = runDate ? new Date(runDate).toLocaleString() : '—';

  const scoreDisplay = runScore !== null ? runScore.toFixed(2) : '—';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-4xl'>
        <DialogHeader>
          <DialogTitle>
            {t('admin.ai.checks.results.title', 'Run Results')} —{' '}
            {t('admin.ai.checks.results.score', 'Score')}: {scoreDisplay} |{' '}
            {formattedDate}
          </DialogTitle>
        </DialogHeader>
        <div className='max-h-[60vh] overflow-y-auto'>
          {isLoading ? (
            <p className='py-8 text-center text-sm text-muted-foreground'>
              {t('admin.ai.checks.results.loading', 'Loading results...')}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    {t('admin.ai.checks.results.table.question', 'Question')}
                  </TableHead>
                  <TableHead>
                    {t('admin.ai.checks.results.table.refAnswer', 'Ref Answer')}
                  </TableHead>
                  <TableHead>
                    {t(
                      'admin.ai.checks.results.table.actualAnswer',
                      'Actual Answer'
                    )}
                  </TableHead>
                  <TableHead>
                    {t('admin.ai.checks.results.table.score', 'Score')}
                  </TableHead>
                  <TableHead>
                    {t('admin.ai.checks.results.table.verdict', 'Verdict')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!results || results.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className='py-8 text-center text-muted-foreground'
                    >
                      {t(
                        'admin.ai.checks.results.table.emptyState',
                        'No results found'
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  results.map((result, index) => (
                    <TableRow key={index}>
                      <TableCell className='text-sm align-top max-w-[200px]'>
                        {result.question}
                      </TableCell>
                      <TableCell className='text-sm align-top max-w-[200px] text-muted-foreground'>
                        {result.referenceAnswer}
                      </TableCell>
                      <TableCell className='text-sm align-top max-w-[200px]'>
                        {result.actualAnswer != null ? (
                          <>
                            {result.actualAnswer}
                            {result.log && (
                              <details className='mt-1'>
                                <summary className='cursor-pointer text-xs text-muted-foreground hover:text-foreground'>
                                  {t(
                                    'admin.ai.checks.results.table.viewLog',
                                    'View log'
                                  )}
                                </summary>
                                <pre className='mt-1 max-w-xs whitespace-pre-wrap break-words rounded bg-muted p-2 text-xs'>
                                  {result.log}
                                </pre>
                              </details>
                            )}
                          </>
                        ) : (
                          <span className='text-muted-foreground'>—</span>
                        )}
                      </TableCell>
                      <TableCell className='text-sm align-top'>
                        {result.score !== null ? result.score.toFixed(2) : '—'}
                      </TableCell>
                      <TableCell className='align-top'>
                        <VerdictBadge score={result.score} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
