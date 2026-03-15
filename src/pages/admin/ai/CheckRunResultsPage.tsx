import { Link, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { IconArrowLeft, IconEye } from '@tabler/icons-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  type CheckRunResult,
  useQueryCheckResults,
} from '@/features/admin/ai/checks';

const EMPTY_VALUE = 'N/A';
const PREVIEW_CHAR_LIMIT = 180;
const LOADING_ROW_KEYS = ['loading-1', 'loading-2', 'loading-3', 'loading-4'];

function VerdictBadge({ score }: { score: number | null }) {
  const { t } = useTranslation();

  if (score === null) {
    return <span className='text-muted-foreground'>{EMPTY_VALUE}</span>;
  }

  if (score >= 0.7) {
    return (
      <Badge className='border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50'>
        {t('admin.ai.checks.verdict.pass', 'PASS')}
      </Badge>
    );
  }

  return (
    <Badge className='border border-red-200 bg-red-50 text-red-700 hover:bg-red-50'>
      {t('admin.ai.checks.verdict.fail', 'FAIL')}
    </Badge>
  );
}

function buildResultKey(result: CheckRunResult) {
  return [
    result.question,
    result.referenceAnswer,
    result.actualAnswer ?? '',
    result.score?.toString() ?? '',
    result.log ?? '',
  ].join('::');
}

function getPreviewText(text: string, limit = PREVIEW_CHAR_LIMIT) {
  const normalizedText = text.replace(/\s+/g, ' ').trim();

  if (normalizedText.length <= limit) {
    return normalizedText;
  }

  return `${normalizedText.slice(0, limit).trimEnd()}...`;
}

function ResultPreview({
  text,
  fallback,
}: {
  text: string | null;
  fallback: string;
}) {
  if (!text || text.trim().length === 0) {
    return <span className='text-muted-foreground'>{fallback}</span>;
  }

  return (
    <p className='whitespace-pre-wrap break-words text-sm leading-6 text-foreground/90'>
      {getPreviewText(text)}
    </p>
  );
}

function SummaryMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className='rounded-xl border bg-card p-4 shadow-sm'>
      <p className='text-xs font-medium tracking-wide text-muted-foreground uppercase'>
        {label}
      </p>
      <p className='mt-2 text-2xl font-semibold tracking-tight'>{value}</p>
    </div>
  );
}

function DetailBlock({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  return (
    <section className='space-y-2 rounded-lg border bg-muted/20 p-4'>
      <p className='text-xs font-medium tracking-wide text-muted-foreground uppercase'>
        {label}
      </p>
      <div className='whitespace-pre-wrap break-words text-sm leading-6'>
        {value && value.trim().length > 0 ? (
          value
        ) : (
          <span className='text-muted-foreground'>{EMPTY_VALUE}</span>
        )}
      </div>
    </section>
  );
}

function ResultDetailDialog({ result }: { result: CheckRunResult }) {
  const { t } = useTranslation();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant='link'
          size='sm'
          className='h-auto px-0 text-sm font-medium'
        >
          <IconEye className='size-4' />
          {t('admin.ai.checks.results.viewDetails', 'View details')}
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-4xl p-0 sm:max-w-4xl'>
        <DialogHeader className='border-b px-6 py-5'>
          <DialogTitle>
            {t('admin.ai.checks.results.detailTitle', 'Result details')}
          </DialogTitle>
          <DialogDescription>
            {t(
              'admin.ai.checks.results.detailDescription',
              'Review the full question, reference answer, actual answer, and log for this result.'
            )}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className='max-h-[70vh] px-6 py-5'>
          <div className='space-y-4 pr-4'>
            <DetailBlock
              label={t('admin.ai.checks.table.results.question', 'Question')}
              value={result.question}
            />
            <DetailBlock
              label={t(
                'admin.ai.checks.results.referenceAnswer',
                'Reference answer'
              )}
              value={result.referenceAnswer}
            />
            <DetailBlock
              label={t(
                'admin.ai.checks.table.results.actualAnswer',
                'Actual Answer'
              )}
              value={result.actualAnswer}
            />
            <DetailBlock
              label={t('admin.ai.checks.results.log', 'Log')}
              value={result.log}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default function CheckRunResultsPage() {
  const { runId } = useParams<{ runId: string }>();
  const { t } = useTranslation();
  const { data: results, isLoading } = useQueryCheckResults(runId ?? null);

  const totalResults = results?.length ?? 0;
  const passedResults =
    results?.filter((result) => (result.score ?? 0) >= 0.7).length ?? 0;
  const avgScore =
    totalResults > 0
      ? results!.reduce((sum, result) => sum + (result.score ?? 0), 0) /
        totalResults
      : null;
  const passRate =
    totalResults > 0
      ? `${Math.round((passedResults / totalResults) * 100)}%`
      : EMPTY_VALUE;

  return (
    <div className='flex flex-col gap-6 px-4 lg:px-6'>
      <section className='flex flex-col gap-4 rounded-2xl border bg-card p-4 shadow-sm md:flex-row md:items-start md:justify-between'>
        <div className='flex flex-col gap-4 md:flex-row md:items-start'>
          <Button variant='outline' size='sm' asChild className='w-fit'>
            <Link to='/admin/ai'>
              <IconArrowLeft className='mr-1.5 h-4 w-4' />
              {t('admin.ai.checks.results.back', 'Back')}
            </Link>
          </Button>
          <div className='hidden h-10 w-px bg-border md:block' />
          <div className='space-y-1'>
            <h1 className='text-2xl font-bold tracking-tight'>
              {t('admin.ai.checks.results.title', 'Run Results')}
            </h1>
            <p className='text-sm text-muted-foreground'>
              {t(
                'admin.ai.checks.results.subtitle',
                'Review a compact preview in the table and open details for the full answer.'
              )}
            </p>
            <p className='font-mono text-xs break-all text-muted-foreground'>
              {runId}
            </p>
          </div>
        </div>

        {avgScore !== null && (
          <Badge
            className={
              avgScore >= 0.7
                ? 'w-fit border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm text-emerald-700 hover:bg-emerald-50'
                : 'w-fit border border-red-200 bg-red-50 px-3 py-1 text-sm text-red-700 hover:bg-red-50'
            }
          >
            {t('admin.ai.checks.table.results.score', 'Score')}:{' '}
            {avgScore.toFixed(2)}
          </Badge>
        )}
      </section>

      <section className='grid gap-3 md:grid-cols-3'>
        <SummaryMetric
          label={t('admin.ai.checks.results.summary.total', 'Total results')}
          value={String(totalResults)}
        />
        <SummaryMetric
          label={t(
            'admin.ai.checks.results.summary.averageScore',
            'Average score'
          )}
          value={avgScore !== null ? avgScore.toFixed(2) : EMPTY_VALUE}
        />
        <SummaryMetric
          label={t('admin.ai.checks.results.summary.passRate', 'Pass rate')}
          value={passRate}
        />
      </section>

      {isLoading ? (
        <div className='space-y-2'>
          {LOADING_ROW_KEYS.map((key) => (
            <div key={key} className='h-12 animate-pulse rounded bg-muted' />
          ))}
        </div>
      ) : (
        <section className='overflow-hidden rounded-2xl border bg-card shadow-sm'>
          <Table className='table-fixed min-w-[980px]'>
            <TableHeader className='bg-muted/40'>
              <TableRow>
                <TableHead className='w-[18%] whitespace-normal px-4 py-3'>
                  {t('admin.ai.checks.table.results.question', 'Question')}
                </TableHead>
                <TableHead className='w-[24%] whitespace-normal px-4 py-3'>
                  {t('admin.ai.checks.table.results.refAnswer', 'Ref Answer')}
                </TableHead>
                <TableHead className='w-[30%] whitespace-normal px-4 py-3'>
                  {t(
                    'admin.ai.checks.table.results.actualAnswer',
                    'Actual Answer'
                  )}
                </TableHead>
                <TableHead className='w-[10%] whitespace-normal px-4 py-3'>
                  {t('admin.ai.checks.table.results.score', 'Score')}
                </TableHead>
                <TableHead className='w-[18%] whitespace-normal px-4 py-3'>
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
                results.map((result) => (
                  <TableRow key={buildResultKey(result)} className='align-top'>
                    <TableCell className='px-4 py-4 align-top whitespace-normal'>
                      <p className='line-clamp-3 whitespace-pre-wrap break-words font-medium leading-6'>
                        {result.question}
                      </p>
                    </TableCell>
                    <TableCell className='px-4 py-4 align-top whitespace-normal text-muted-foreground'>
                      <ResultPreview
                        text={result.referenceAnswer}
                        fallback={t(
                          'admin.ai.checks.results.referenceAnswerEmpty',
                          'No reference answer'
                        )}
                      />
                    </TableCell>
                    <TableCell className='px-4 py-4 align-top whitespace-normal'>
                      <div className='space-y-3'>
                        <ResultPreview
                          text={result.actualAnswer}
                          fallback={t(
                            'admin.ai.checks.results.actualAnswerEmpty',
                            'No actual answer'
                          )}
                        />
                        {(result.actualAnswer || result.log) && (
                          <ResultDetailDialog result={result} />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className='px-4 py-4 align-top whitespace-normal text-sm font-medium'>
                      {result.score !== null
                        ? result.score.toFixed(2)
                        : EMPTY_VALUE}
                    </TableCell>
                    <TableCell className='px-4 py-4 align-top whitespace-normal'>
                      <VerdictBadge score={result.score} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </section>
      )}
    </div>
  );
}
