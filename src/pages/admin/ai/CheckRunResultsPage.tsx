import { useParams, Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { IconArrowLeft } from '@tabler/icons-react';
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
import { useQueryCheckResults } from '@/features/admin/ai/checks';

function VerdictBadge({ score }: { score: number | null }) {
  const { t } = useTranslation();
  if (score === null) return <span className='text-muted-foreground'>—</span>;
  if (score >= 0.7)
    return (
      <Badge className='bg-green-100 text-green-800 hover:bg-green-100'>
        {t('admin.ai.checks.verdict.pass', 'PASS')}
      </Badge>
    );
  return (
    <Badge className='bg-red-100 text-red-800 hover:bg-red-100'>
      {t('admin.ai.checks.verdict.fail', 'FAIL')}
    </Badge>
  );
}

export default function CheckRunResultsPage() {
  const { runId } = useParams<{ runId: string }>();
  const { t } = useTranslation();
  const { data: results, isLoading } = useQueryCheckResults(runId ?? null);

  const avgScore =
    results && results.length > 0
      ? results.reduce((sum, r) => sum + (r.score ?? 0), 0) / results.length
      : null;

  return (
    <div className='min-h-screen bg-background'>
      <div className='border-b bg-card px-6 py-4'>
        <div className='flex items-center gap-4'>
          <Button variant='ghost' size='sm' asChild>
            <Link to='/admin/ai'>
              <IconArrowLeft className='mr-1.5 h-4 w-4' />
              {t('admin.ai.checks.results.back', 'Back')}
            </Link>
          </Button>
          <div className='h-5 w-px bg-border' />
          <div>
            <h1 className='text-base font-semibold leading-tight'>
              {t('admin.ai.checks.results.title', 'Run Results')}
            </h1>
            <p className='mt-0.5 font-mono text-xs text-muted-foreground'>
              {runId}
            </p>
          </div>
          {avgScore !== null && (
            <Badge
              className={
                avgScore >= 0.7
                  ? 'ml-auto bg-green-100 text-green-800 hover:bg-green-100'
                  : 'ml-auto bg-red-100 text-red-800 hover:bg-red-100'
              }
            >
              {t('admin.ai.checks.table.results.score', 'Score')}:{' '}
              {avgScore.toFixed(2)}
            </Badge>
          )}
        </div>
      </div>

      <div className='p-6'>
        {isLoading ? (
          <div className='space-y-2'>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className='h-12 animate-pulse rounded bg-muted' />
            ))}
          </div>
        ) : (
          <div className='rounded-lg border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[22%]'>
                    {t('admin.ai.checks.table.results.question', 'Question')}
                  </TableHead>
                  <TableHead className='w-[22%]'>
                    {t('admin.ai.checks.table.results.refAnswer', 'Ref Answer')}
                  </TableHead>
                  <TableHead className='w-[36%]'>
                    {t(
                      'admin.ai.checks.table.results.actualAnswer',
                      'Actual Answer'
                    )}
                  </TableHead>
                  <TableHead className='w-[10%]'>
                    {t('admin.ai.checks.table.results.score', 'Score')}
                  </TableHead>
                  <TableHead className='w-[10%]'>
                    {t('admin.ai.checks.table.results.verdict', 'Verdict')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!results || results.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className='py-12 text-center text-muted-foreground'
                    >
                      {t(
                        'admin.ai.checks.results.emptyState',
                        'No results found'
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  results.map((result, index) => (
                    <TableRow key={index}>
                      <TableCell className='align-top text-sm'>
                        {result.question}
                      </TableCell>
                      <TableCell className='align-top text-sm text-muted-foreground'>
                        {result.referenceAnswer}
                      </TableCell>
                      <TableCell className='align-top text-sm'>
                        {result.actualAnswer != null ? (
                          <>
                            <p className='whitespace-pre-wrap'>
                              {result.actualAnswer}
                            </p>
                            {result.log && (
                              <details className='mt-2'>
                                <summary className='cursor-pointer text-xs text-muted-foreground hover:text-foreground'>
                                  {t(
                                    'admin.ai.checks.results.viewLog',
                                    'View log'
                                  )}
                                </summary>
                                <pre className='mt-1 whitespace-pre-wrap break-words rounded bg-muted p-2 text-xs'>
                                  {result.log}
                                </pre>
                              </details>
                            )}
                          </>
                        ) : (
                          <span className='text-muted-foreground'>—</span>
                        )}
                      </TableCell>
                      <TableCell className='align-top text-sm'>
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
          </div>
        )}
      </div>
    </div>
  );
}
