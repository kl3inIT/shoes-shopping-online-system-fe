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
  CheckDefTable,
  CheckDefDialog,
  useQueryCheckDefs,
  useCreateCheckDefMutation,
  useUpdateCheckDefMutation,
  useToggleCheckDefMutation,
  useDeleteCheckDefMutation,
  type CheckDef,
  type CheckDefFormValues,
} from '@/features/admin/ai/checks';
import { ChecksPagination } from '@/features/admin/ai/checks/components/ChecksPagination';

export function DefinitionsTab() {
  const { t } = useTranslation();

  // Dialog state
  const [defDialogOpen, setDefDialogOpen] = useState(false);
  const [editDef, setEditDef] = useState<CheckDef | null>(null);
  const [deleteDefId, setDeleteDefId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Client-side pagination
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Query
  const { data: defs, isLoading, isError } = useQueryCheckDefs();

  // Mutations
  const createMutation = useCreateCheckDefMutation();
  const updateMutation = useUpdateCheckDefMutation();
  const toggleMutation = useToggleCheckDefMutation();
  const deleteMutation = useDeleteCheckDefMutation();

  // Client-side pagination logic
  const allDefs = defs ?? [];
  const totalElements = allDefs.length;
  const totalPages = Math.max(1, Math.ceil(totalElements / pageSize));
  const pagedDefs = allDefs.slice(page * pageSize, (page + 1) * pageSize);

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

  return (
    <div className='space-y-4'>
      {/* Header */}
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

      {/* Error banner */}
      {isError && (
        <div className='rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive'>
          {t('admin.ai.checks.fetchError', 'Failed to load check definitions')}
        </div>
      )}

      {/* Table */}
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

      {/* Pagination */}
      {!isLoading && totalElements > 0 && (
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
      )}

      {/* Create / Edit dialog */}
      <CheckDefDialog
        open={defDialogOpen}
        onOpenChange={setDefDialogOpen}
        editDef={editDef}
        onSave={handleSaveDef}
        isSaving={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete confirmation dialog */}
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
