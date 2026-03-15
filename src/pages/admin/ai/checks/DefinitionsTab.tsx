import { useState } from 'react';
import { CheckCheck, FileText, PauseCircle, Plus } from 'lucide-react';
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
  CheckDefDialog,
  CheckDefTable,
  type CheckDef,
  type CheckDefFormValues,
  useCreateCheckDefMutation,
  useDeleteCheckDefMutation,
  useQueryCheckDefs,
  useToggleCheckDefMutation,
  useUpdateCheckDefMutation,
} from '@/features/admin/ai/checks';
import { ChecksPagination } from '@/features/admin/ai/checks/components/ChecksPagination';
import {
  OperationsMetricCard,
  OperationsMetricGrid,
  OperationsSection,
} from '../components/OperationsSection';

export function DefinitionsTab() {
  const { t } = useTranslation();
  const [defDialogOpen, setDefDialogOpen] = useState(false);
  const [editDef, setEditDef] = useState<CheckDef | null>(null);
  const [deleteDefId, setDeleteDefId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const { data: defs, isLoading, isError } = useQueryCheckDefs();
  const createMutation = useCreateCheckDefMutation();
  const updateMutation = useUpdateCheckDefMutation();
  const toggleMutation = useToggleCheckDefMutation();
  const deleteMutation = useDeleteCheckDefMutation();

  const allDefs = defs ?? [];
  const activeDefinitions = allDefs.filter((def) => def.active).length;
  const inactiveDefinitions = allDefs.length - activeDefinitions;
  const totalElements = allDefs.length;
  const totalPages = Math.max(1, Math.ceil(totalElements / pageSize));
  const pagedDefs = allDefs.slice(page * pageSize, (page + 1) * pageSize);

  const handleSaveDef = (formValues: CheckDefFormValues) => {
    if (editDef) {
      updateMutation.mutate(
        { id: editDef.id, payload: formValues },
        { onSuccess: () => setDefDialogOpen(false) }
      );
      return;
    }

    createMutation.mutate(formValues, {
      onSuccess: () => setDefDialogOpen(false),
    });
  };

  const handleConfirmDelete = () => {
    if (deleteDefId) {
      deleteMutation.mutate(deleteDefId);
    }

    setDeleteDialogOpen(false);
  };

  return (
    <div className='space-y-4'>
      <OperationsMetricGrid>
        <OperationsMetricCard
          label={t('admin.ai.checks.summary.totalDefinitions', {
            defaultValue: 'Total definitions',
          })}
          value={String(totalElements)}
          hint={t('admin.ai.checks.summary.totalDefinitionsHint', {
            defaultValue:
              'The full set of evaluation questions currently stored.',
          })}
          icon={FileText}
        />
        <OperationsMetricCard
          label={t('admin.ai.checks.summary.activeDefinitions', {
            defaultValue: 'Active definitions',
          })}
          value={String(activeDefinitions)}
          hint={t('admin.ai.checks.summary.activeDefinitionsHint', {
            defaultValue: 'These definitions will be included when checks run.',
          })}
          icon={CheckCheck}
        />
        <OperationsMetricCard
          label={t('admin.ai.checks.summary.inactiveDefinitions', {
            defaultValue: 'Inactive definitions',
          })}
          value={String(inactiveDefinitions)}
          hint={t('admin.ai.checks.summary.inactiveDefinitionsHint', {
            defaultValue:
              'Keep drafts here without affecting production evaluations.',
          })}
          icon={PauseCircle}
        />
      </OperationsMetricGrid>

      <OperationsSection
        title={t('admin.ai.checks.section.definitions', 'Check Definitions')}
        description={t('admin.ai.checks.section.definitionsDescription', {
          defaultValue:
            'Keep each check focused on a single behavior so failures are easy to diagnose from the results page.',
        })}
        actions={
          <Button
            onClick={() => {
              setEditDef(null);
              setDefDialogOpen(true);
            }}
          >
            <Plus className='size-4' />
            {t('admin.ai.checks.button.addDefinition', 'Add Definition')}
          </Button>
        }
        contentClassName='space-y-4'
      >
        {isError ? (
          <div className='rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive'>
            {t(
              'admin.ai.checks.fetchError',
              'Failed to load check definitions'
            )}
          </div>
        ) : null}

        <CheckDefTable
          defs={pagedDefs}
          isLoading={isLoading}
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

        {!isLoading && totalElements > 0 ? (
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
            isFirst={page === 0}
            isLast={page >= totalPages - 1}
          />
        ) : null}
      </OperationsSection>

      <CheckDefDialog
        open={defDialogOpen}
        onOpenChange={setDefDialogOpen}
        editDef={editDef}
        onSave={handleSaveDef}
        isSaving={createMutation.isPending || updateMutation.isPending}
      />

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
