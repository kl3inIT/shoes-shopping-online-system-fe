import { useState } from 'react';
import { Activity, Gauge, PlayCircle, TimerReset } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  CheckRunHistoryTable,
  useDeleteCheckRunMutation,
  useQueryCheckRuns,
  useTriggerRunMutation,
} from '@/features/admin/ai/checks';
import { ChecksPagination } from '@/features/admin/ai/checks/components/ChecksPagination';
import {
  OperationsMetricCard,
  OperationsMetricGrid,
  OperationsSection,
} from '../components/OperationsSection';

export function RunHistoryTab() {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [latestScore, setLatestScore] = useState<number | null>(null);
  const [deleteRunId, setDeleteRunId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: runsData, isLoading } = useQueryCheckRuns({
    page,
    size: pageSize,
  });

  const triggerMutation = useTriggerRunMutation({
    onScore: (score) => setLatestScore(score),
  });
  const deleteMutation = useDeleteCheckRunMutation();

  const totalPages = runsData?.totalPages ?? 0;
  const totalElements = runsData?.totalElements ?? 0;
  const averageScore =
    runsData && runsData.content.length > 0
      ? runsData.content.reduce((sum, run) => sum + (run.score ?? 0), 0) /
        runsData.content.length
      : null;

  const handleConfirmDelete = () => {
    if (deleteRunId) {
      deleteMutation.mutate(deleteRunId);
    }

    setDeleteDialogOpen(false);
  };

  return (
    <div className='space-y-4'>
      <OperationsMetricGrid>
        <OperationsMetricCard
          label={t('admin.ai.checks.summary.runCount', {
            defaultValue: 'Total runs',
          })}
          value={String(totalElements)}
          hint={t('admin.ai.checks.summary.runCountHint', {
            defaultValue:
              'Stored executions you can reopen for detailed analysis.',
          })}
          icon={Activity}
        />
        <OperationsMetricCard
          label={t('admin.ai.checks.summary.latestScore', {
            defaultValue: 'Latest score',
          })}
          value={
            latestScore !== null
              ? latestScore.toFixed(2)
              : t('admin.ai.checks.summary.emptyMetric', {
                  defaultValue: 'N/A',
                })
          }
          hint={t('admin.ai.checks.summary.latestScoreHint', {
            defaultValue: 'Updated immediately after a successful run.',
          })}
          icon={PlayCircle}
        />
        <OperationsMetricCard
          label={t('admin.ai.checks.summary.pageAverage', {
            defaultValue: 'Current page average',
          })}
          value={
            averageScore !== null
              ? averageScore.toFixed(2)
              : t('admin.ai.checks.summary.emptyMetric', {
                  defaultValue: 'N/A',
                })
          }
          hint={t('admin.ai.checks.summary.pageAverageHint', {
            defaultValue:
              'Quick signal for recent quality without opening every run.',
          })}
          icon={Gauge}
        />
      </OperationsMetricGrid>

      <OperationsSection
        title={t('admin.ai.checks.section.runHistory', 'Run History')}
        description={t('admin.ai.checks.section.runHistoryDescription', {
          defaultValue:
            'Use the history as an operational timeline: trigger a run, compare the score, then open detailed results only where quality changed.',
        })}
        actions={
          <Button
            disabled={triggerMutation.isPending}
            onClick={() => triggerMutation.mutate()}
          >
            {triggerMutation.isPending ? (
              <>
                <TimerReset className='size-4 animate-spin' />
                {t('admin.ai.checks.button.running', 'Running...')}
              </>
            ) : (
              <>
                <PlayCircle className='size-4' />
                {t('admin.ai.checks.button.runChecks', 'Run Checks')}
              </>
            )}
          </Button>
        }
        contentClassName='space-y-4'
      >
        <CheckRunHistoryTable
          runs={runsData?.content ?? []}
          isLoading={isLoading}
          onDelete={(id) => {
            setDeleteRunId(id);
            setDeleteDialogOpen(true);
          }}
        />

        <ChecksPagination
          page={page}
          totalPages={totalPages}
          totalElements={totalElements}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(0);
          }}
          isFirst={runsData?.first ?? true}
          isLast={runsData?.last ?? true}
        />
      </OperationsSection>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t('admin.ai.checks.dialog.deleteRunTitle', 'Delete Run')}
            </DialogTitle>
          </DialogHeader>
          <p className='text-sm text-muted-foreground'>
            {t(
              'admin.ai.checks.dialog.deleteRunBody',
              'Delete this run and all its results? This cannot be undone.'
            )}
          </p>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setDeleteDialogOpen(false)}
            >
              {t('admin.ai.checks.dialog.cancel', 'Cancel')}
            </Button>
            <Button variant='destructive' onClick={handleConfirmDelete}>
              {t('admin.ai.checks.dialog.deleteConfirm', 'Delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
