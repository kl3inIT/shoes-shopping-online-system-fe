import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  CheckDefTable,
  CheckDefDialog,
  CheckRunHistoryTable,
  useQueryCheckDefs,
  useQueryCheckRuns,
  useCreateCheckDefMutation,
  useUpdateCheckDefMutation,
  useToggleCheckDefMutation,
  useDeleteCheckDefMutation,
  useTriggerRunMutation,
  type CheckDef,
  type CheckDefFormValues,
} from '@/features/admin/ai/checks';

export function AiChecksTab() {
  const { t } = useTranslation();

  // Definition CRUD dialogs
  const [defDialogOpen, setDefDialogOpen] = useState(false);
  const [editDef, setEditDef] = useState<CheckDef | null>(null);
  const [deleteDefId, setDeleteDefId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Run trigger
  const [latestScore, setLatestScore] = useState<number | null>(null);

  // Run history pagination
  const [runsPage, setRunsPage] = useState(0);

  // Queries
  const {
    data: defs,
    isLoading: defsLoading,
    isError: defsError,
  } = useQueryCheckDefs();
  const { data: runsData, isLoading: runsLoading } = useQueryCheckRuns({
    page: runsPage,
    size: 20,
  });

  // Mutations
  const createMutation = useCreateCheckDefMutation();
  const updateMutation = useUpdateCheckDefMutation();
  const toggleMutation = useToggleCheckDefMutation();
  const deleteMutation = useDeleteCheckDefMutation();
  const triggerMutation = useTriggerRunMutation({
    onScore: (s) => setLatestScore(s),
  });

  const totalRunPages = runsData?.totalPages ?? 0;

  // Callbacks
  const handleSaveDef = (formValues: CheckDefFormValues) => {
    if (editDef) {
      updateMutation.mutate(
        { id: editDef.id, payload: formValues },
        { onSuccess: () => setDefDialogOpen(false) }
      );
    } else {
      createMutation.mutate(formValues, {
        onSuccess: () => setDefDialogOpen(false),
      });
    }
  };

  const handleConfirmDelete = () => {
    if (deleteDefId) {
      deleteMutation.mutate(deleteDefId);
    }
    setDeleteDialogOpen(false);
  };

  const handleViewResults = (runId: string) => {
    window.open(`/admin/ai/checks/runs/${runId}`, '_blank');
  };

  return (
    <div className='space-y-6'>
      {/* Section 1 — Check Definitions */}
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-semibold'>
            {t('admin.ai.checks.section.definitions', 'Check Definitions')}
          </h2>
          <Button
            onClick={() => {
              setEditDef(null);
              setDefDialogOpen(true);
            }}
          >
            {t('admin.ai.checks.button.addDefinition', 'Add Definition')}
          </Button>
        </div>
        {defsError && (
          <div className='rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive'>
            {t(
              'admin.ai.checks.fetchError',
              'Failed to load check definitions'
            )}
          </div>
        )}
        {!defsLoading && !defsError && defs && (
          <p className='text-sm text-muted-foreground'>
            {t('admin.ai.checks.totalDefs', '{{count}} definition(s)', {
              count: defs.length,
            })}
          </p>
        )}
        <CheckDefTable
          defs={defs ?? []}
          isLoading={defsLoading}
          onEdit={(def) => {
            setEditDef(def);
            setDefDialogOpen(true);
          }}
          onDelete={(id) => {
            setDeleteDefId(id);
            setDeleteDialogOpen(true);
          }}
          onToggleActive={(id, active) => toggleMutation.mutate({ id, active })}
        />
      </div>

      {/* Section 2 — Run History */}
      <div className='space-y-4'>
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
        <CheckRunHistoryTable
          runs={runsData?.content ?? []}
          isLoading={runsLoading}
          onViewResults={handleViewResults}
        />
        {totalRunPages > 0 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setRunsPage((p) => Math.max(0, p - 1))}
                  aria-disabled={runsData?.first}
                  className={
                    runsData?.first ? 'pointer-events-none opacity-50' : ''
                  }
                />
              </PaginationItem>
              <PaginationItem>
                <span className='px-4 text-sm text-muted-foreground select-none'>
                  {t(
                    'admin.ai.checks.pagination.pageOf',
                    'Page {{page}} of {{total}}',
                    {
                      page: (runsData?.number ?? 0) + 1,
                      total: totalRunPages,
                    }
                  )}
                </span>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setRunsPage((p) => Math.min(totalRunPages - 1, p + 1))
                  }
                  aria-disabled={runsData?.last}
                  className={
                    runsData?.last ? 'pointer-events-none opacity-50' : ''
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>

      {/* Dialogs */}
      <CheckDefDialog
        open={defDialogOpen}
        onOpenChange={setDefDialogOpen}
        editDef={editDef}
        onSave={handleSaveDef}
        isSaving={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t(
                'admin.ai.checks.dialog.deleteTitle',
                'Delete Check Definition'
              )}
            </DialogTitle>
          </DialogHeader>
          <p className='text-sm text-muted-foreground'>
            {t(
              'admin.ai.checks.dialog.deleteBody',
              'Delete this check definition? This cannot be undone.'
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
