import { useState } from 'react';
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
  useQueryCheckRuns,
  useTriggerRunMutation,
  useDeleteCheckRunMutation,
} from '@/features/admin/ai/checks';
import { ChecksPagination } from '@/features/admin/ai/checks/components/ChecksPagination';

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
    onScore: (s) => setLatestScore(s),
  });
  const deleteMutation = useDeleteCheckRunMutation();

  const totalPages = runsData?.totalPages ?? 0;
  const totalElements = runsData?.totalElements ?? 0;

  const handleConfirmDelete = () => {
    if (deleteRunId) deleteMutation.mutate(deleteRunId);
    setDeleteDialogOpen(false);
  };

  return (
    <div className='space-y-4'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-semibold'>
          {t('admin.ai.checks.section.runHistory', 'Run History')}
        </h2>
        <div className='flex items-center gap-3'>
          {latestScore !== null && (
            <span className='text-sm font-medium text-muted-foreground'>
              {t('admin.ai.checks.badge.latestScore', 'Latest: {{score}} ✓', {
                score: latestScore.toFixed(2),
              })}
            </span>
          )}
          <Button
            disabled={triggerMutation.isPending}
            onClick={() => triggerMutation.mutate()}
          >
            {triggerMutation.isPending ? (
              <>
                <span className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
                {t('admin.ai.checks.button.running', 'Running...')}
              </>
            ) : (
              t('admin.ai.checks.button.runChecks', 'Run Checks')
            )}
          </Button>
        </div>
      </div>

      {/* Table */}
      <CheckRunHistoryTable
        runs={runsData?.content ?? []}
        isLoading={isLoading}
        onDelete={(id) => {
          setDeleteRunId(id);
          setDeleteDialogOpen(true);
        }}
      />

      {/* Pagination */}
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

      {/* Delete confirmation */}
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
