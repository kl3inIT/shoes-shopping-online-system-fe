import { useState } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { getErrorMessage } from '@/features/apiClient';
import {
  VectorDocumentTable,
  VectorDocumentDetail,
  VectorIngestionToolbar,
  VectorFilterBar,
  DeleteSelectedDialog,
  DeleteByFilterDialog,
  useQueryVectorDocs,
  useQueryIngesterTypes,
  useDeleteVectorDocumentMutation,
  useDeleteVectorDocumentsByIdsMutation,
  useDeleteVectorDocumentsMutation,
  useIngestMutation,
  useIngestByTypeMutation,
  type VectorDocument,
} from '@/features/admin/ai/vector-store';

export function AiVectorStoreTab() {
  const { t } = useTranslation();

  // Pagination + filter state
  const [page, setPage] = useState(0);
  const [filterInput, setFilterInput] = useState('');
  const [appliedFilter, setAppliedFilter] = useState('');
  const [filterError, setFilterError] = useState<string | null>(null);

  // Selection state — clear when filter or page changes
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());

  // Dialog open state
  const [detailDoc, setDetailDoc] = useState<VectorDocument | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteSelectedOpen, setDeleteSelectedOpen] = useState(false);
  const [deleteByFilterOpen, setDeleteByFilterOpen] = useState(false);

  // Queries
  const { data, isLoading, isError, error } = useQueryVectorDocs({
    page,
    size: 20,
    filter: appliedFilter || undefined,
  });
  const { data: types = [] } = useQueryIngesterTypes();
  const docs = data?.content ?? [];

  // Mutations
  const deleteOneMutation = useDeleteVectorDocumentMutation();
  const deleteByIdsMutation = useDeleteVectorDocumentsByIdsMutation();
  const deleteByFilterMutation = useDeleteVectorDocumentsMutation();
  const ingestAllMutation = useIngestMutation();
  const ingestByTypeMutation = useIngestByTypeMutation();

  // Selection handlers
  const toggleSelectAll = (checked: boolean) =>
    setSelectedIds(checked ? new Set(docs.map((d) => d.id)) : new Set());
  const toggleSelectOne = (id: string, checked: boolean) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });

  // Filter handlers — clear selection on apply
  const handleApplyFilter = () => {
    setAppliedFilter(filterInput);
    setPage(0);
    setSelectedIds(new Set());
    setFilterError(null);
  };
  const handleClearFilter = () => {
    setFilterInput('');
    setAppliedFilter('');
    setPage(0);
    setSelectedIds(new Set());
    setFilterError(null);
  };

  // Delete selected confirm
  const handleDeleteSelected = () => {
    const ids = Array.from(selectedIds);
    deleteByIdsMutation.mutate(ids, {
      onSuccess: () => {
        setSelectedIds(new Set());
        setDeleteSelectedOpen(false);
        toast.success(
          t('admin.ai.vector.toast.bulkDeleted', 'Documents deleted')
        );
      },
      onError: (err) => toast.error(getErrorMessage(err)),
    });
  };

  // Delete by filter confirm
  const handleDeleteByFilter = () => {
    deleteByFilterMutation.mutate(appliedFilter, {
      onSuccess: () => {
        setDeleteByFilterOpen(false);
        setAppliedFilter('');
        setFilterInput('');
        setSelectedIds(new Set());
        toast.success(
          t('admin.ai.vector.toast.bulkDeleted', 'Documents deleted')
        );
      },
      onError: (err) => {
        setFilterError(getErrorMessage(err));
        setDeleteByFilterOpen(false);
      },
    });
  };

  // Pagination
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className='space-y-4'>
      <VectorIngestionToolbar
        types={types}
        isIngestingAll={ingestAllMutation.isPending}
        ingestingType={
          ingestByTypeMutation.isPending
            ? (ingestByTypeMutation.variables ?? null)
            : null
        }
        onIngestAll={() => ingestAllMutation.mutate()}
        onIngestByType={(type) => ingestByTypeMutation.mutate(type)}
      />
      <VectorFilterBar
        value={filterInput}
        onChange={setFilterInput}
        onApply={handleApplyFilter}
        onClear={handleClearFilter}
        error={filterError}
      />
      {/* Bulk action toolbar — only visible when rows selected */}
      {selectedIds.size > 0 && (
        <div className='flex items-center gap-2 rounded-md border border-border p-2'>
          <span className='text-sm'>
            {t('admin.ai.vector.selectedCount', '{{count}} selected', {
              count: selectedIds.size,
            })}
          </span>
          <Button
            variant='destructive'
            size='sm'
            onClick={() => setDeleteSelectedOpen(true)}
          >
            {t('admin.ai.vector.deleteSelected', 'Delete selected')}
          </Button>
        </div>
      )}
      {/* Delete by filter button — visible when filter is active */}
      {appliedFilter && (
        <div className='flex justify-end'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setDeleteByFilterOpen(true)}
          >
            {t('admin.ai.vector.deleteByFilter', 'Delete by filter')}
          </Button>
        </div>
      )}
      {/* Document count summary */}
      {!isLoading && !isError && data && (
        <p className='text-sm text-muted-foreground'>
          {t('admin.ai.vector.totalDocuments', '{{count}} document(s) total', {
            count: data.totalElements,
          })}
        </p>
      )}
      {/* Fetch error banner */}
      {isError && (
        <div className='rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive'>
          {t('admin.ai.vector.fetchError', 'Failed to load documents')}
          {': '}
          {getErrorMessage(error)}
        </div>
      )}
      <VectorDocumentTable
        docs={docs}
        isLoading={isLoading}
        isError={isError}
        selectedIds={selectedIds}
        onSelectAll={toggleSelectAll}
        onSelectOne={toggleSelectOne}
        onViewDetail={(doc) => {
          setDetailDoc(doc);
          setDetailOpen(true);
        }}
        onDeleteOne={(id) =>
          deleteOneMutation.mutate(id, {
            onSuccess: () =>
              toast.success(
                t('admin.ai.vector.toast.deleted', 'Document deleted')
              ),
            onError: (err) => toast.error(getErrorMessage(err)),
          })
        }
      />
      {/* Pagination */}
      {totalPages > 0 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                aria-disabled={data?.first}
                className={data?.first ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
            <PaginationItem>
              <span className='px-4 text-sm text-muted-foreground select-none'>
                {t(
                  'admin.ai.vector.pagination.pageOf',
                  'Page {{page}} of {{total}}',
                  {
                    page: (data?.number ?? 0) + 1,
                    total: totalPages,
                  }
                )}
              </span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                aria-disabled={data?.last}
                className={data?.last ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
      <VectorDocumentDetail
        doc={detailDoc}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
      <DeleteSelectedDialog
        open={deleteSelectedOpen}
        count={selectedIds.size}
        isPending={deleteByIdsMutation.isPending}
        onConfirm={handleDeleteSelected}
        onCancel={() => setDeleteSelectedOpen(false)}
      />
      <DeleteByFilterDialog
        open={deleteByFilterOpen}
        filter={appliedFilter}
        isPending={deleteByFilterMutation.isPending}
        onConfirm={handleDeleteByFilter}
        onCancel={() => setDeleteByFilterOpen(false)}
      />
    </div>
  );
}
