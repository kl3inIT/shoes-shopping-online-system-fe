import { useState } from 'react';
import { Database, Filter, ScanSearch, Trash2 } from 'lucide-react';
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
  DeleteByFilterDialog,
  DeleteSelectedDialog,
  VectorDocumentDetail,
  VectorDocumentTable,
  VectorFilterBar,
  VectorIngestionToolbar,
  type VectorDocument,
  useDeleteVectorDocumentMutation,
  useDeleteVectorDocumentsByIdsMutation,
  useDeleteVectorDocumentsMutation,
  useIngestByTypeMutation,
  useIngestMutation,
  useQueryIngesterTypes,
  useQueryVectorDocs,
} from '@/features/admin/ai/vector-store';
import {
  OperationsMetricCard,
  OperationsMetricGrid,
  OperationsSection,
} from './components/OperationsSection';

export function AiVectorStoreTab() {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [filterInput, setFilterInput] = useState('');
  const [appliedFilter, setAppliedFilter] = useState('');
  const [filterError, setFilterError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [detailDoc, setDetailDoc] = useState<VectorDocument | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteSelectedOpen, setDeleteSelectedOpen] = useState(false);
  const [deleteByFilterOpen, setDeleteByFilterOpen] = useState(false);

  const { data, isLoading, isError, error } = useQueryVectorDocs({
    page,
    size: 20,
    filter: appliedFilter || undefined,
  });
  const { data: types = [] } = useQueryIngesterTypes();

  const docs = data?.content ?? [];
  const deleteOneMutation = useDeleteVectorDocumentMutation();
  const deleteByIdsMutation = useDeleteVectorDocumentsByIdsMutation();
  const deleteByFilterMutation = useDeleteVectorDocumentsMutation();
  const ingestAllMutation = useIngestMutation();
  const ingestByTypeMutation = useIngestByTypeMutation();
  const totalPages = data?.totalPages ?? 0;

  const toggleSelectAll = (checked: boolean) =>
    setSelectedIds(checked ? new Set(docs.map((doc) => doc.id)) : new Set());

  const toggleSelectOne = (id: string, checked: boolean) =>
    setSelectedIds((previous) => {
      const next = new Set(previous);

      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }

      return next;
    });

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
      onError: (mutationError) => toast.error(getErrorMessage(mutationError)),
    });
  };

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
      onError: (mutationError) => {
        setFilterError(getErrorMessage(mutationError));
        setDeleteByFilterOpen(false);
      },
    });
  };

  return (
    <div className='space-y-4'>
      <OperationsMetricGrid>
        <OperationsMetricCard
          label={t('admin.ai.vector.summary.totalDocuments', {
            defaultValue: 'Total documents',
          })}
          value={String(data?.totalElements ?? 0)}
          hint={t('admin.ai.vector.summary.totalDocumentsHint', {
            defaultValue: 'Indexed records currently available to retrieval.',
          })}
          icon={Database}
        />
        <OperationsMetricCard
          label={t('admin.ai.vector.summary.selectedRows', {
            defaultValue: 'Selected rows',
          })}
          value={String(selectedIds.size)}
          hint={t('admin.ai.vector.summary.selectedRowsHint', {
            defaultValue:
              'Bulk actions only appear when you intentionally select records.',
          })}
          icon={Trash2}
        />
        <OperationsMetricCard
          label={t('admin.ai.vector.summary.filterState', {
            defaultValue: 'Filter state',
          })}
          value={
            appliedFilter ||
            t('admin.ai.vector.summary.noFilter', {
              defaultValue: 'No filter applied',
            })
          }
          hint={t('admin.ai.vector.summary.filterStateHint', {
            defaultValue:
              'Apply metadata filters before deleting or investigating a subset.',
          })}
          icon={Filter}
        />
      </OperationsMetricGrid>

      <OperationsSection
        title={t('admin.ai.vector.section.controls', {
          defaultValue: 'Indexing Controls',
        })}
        description={t('admin.ai.vector.section.controlsDescription', {
          defaultValue:
            'Run a full ingest when the knowledge base changes broadly, or scope the run by source type when only part of the corpus needs to refresh.',
        })}
        contentClassName='space-y-4'
      >
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

        {selectedIds.size > 0 ? (
          <div className='flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/70 bg-muted/20 px-4 py-3'>
            <span className='text-sm text-muted-foreground'>
              {t('admin.ai.vector.selectedCount', '{{count}} selected', {
                count: selectedIds.size,
              })}
            </span>
            <Button
              variant='destructive'
              size='sm'
              onClick={() => setDeleteSelectedOpen(true)}
            >
              <Trash2 className='size-4' />
              {t('admin.ai.vector.deleteSelectedAction', 'Delete selected')}
            </Button>
          </div>
        ) : null}

        {appliedFilter ? (
          <div className='flex justify-end'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setDeleteByFilterOpen(true)}
            >
              <ScanSearch className='size-4' />
              {t('admin.ai.vector.deleteByFilterAction', 'Delete by filter')}
            </Button>
          </div>
        ) : null}
      </OperationsSection>

      <OperationsSection
        title={t('admin.ai.vector.section.documents', {
          defaultValue: 'Indexed Documents',
        })}
        description={t('admin.ai.vector.section.documentsDescription', {
          defaultValue:
            'Use the table for quick scanning. Open detail only when the excerpt or metadata suggests a problem.',
        })}
        contentClassName='space-y-4'
      >
        {!isLoading && !isError && data ? (
          <div className='rounded-xl border bg-muted/20 px-4 py-3 text-sm text-muted-foreground'>
            {t(
              'admin.ai.vector.totalDocuments',
              '{{count}} document(s) total',
              {
                count: data.totalElements,
              }
            )}
          </div>
        ) : null}

        {isError ? (
          <div className='rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive'>
            {t('admin.ai.vector.fetchError', 'Failed to load documents')}
            {': '}
            {getErrorMessage(error)}
          </div>
        ) : null}

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
              onError: (mutationError) =>
                toast.error(getErrorMessage(mutationError)),
            })
          }
        />

        {totalPages > 0 ? (
          <Pagination className='justify-between'>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setPage((currentPage) => Math.max(0, currentPage - 1))
                  }
                  aria-disabled={data?.first}
                  className={
                    data?.first ? 'pointer-events-none opacity-50' : ''
                  }
                />
              </PaginationItem>
            </PaginationContent>
            <div className='px-4 text-sm text-muted-foreground'>
              {t(
                'admin.ai.vector.pagination.pageOf',
                'Page {{page}} of {{total}}',
                {
                  page: (data?.number ?? 0) + 1,
                  total: totalPages,
                }
              )}
            </div>
            <PaginationContent>
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setPage((currentPage) =>
                      Math.min(totalPages - 1, currentPage + 1)
                    )
                  }
                  aria-disabled={data?.last}
                  className={data?.last ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        ) : null}
      </OperationsSection>

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
