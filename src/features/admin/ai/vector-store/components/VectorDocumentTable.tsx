import { IconDots, IconEye, IconTrash } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { VectorDocument } from '../types';

interface VectorDocumentTableProps {
  docs: VectorDocument[];
  isLoading: boolean;
  isError?: boolean;
  selectedIds: Set<string>;
  onSelectAll: (checked: boolean) => void;
  onSelectOne: (id: string, checked: boolean) => void;
  onViewDetail: (doc: VectorDocument) => void;
  onDeleteOne: (id: string) => void;
}

function formatPreview(value: string, limit: number) {
  if (value.length <= limit) {
    return value;
  }

  return `${value.slice(0, limit).trimEnd()}...`;
}

export function VectorDocumentTable({
  docs,
  isLoading,
  isError = false,
  selectedIds,
  onSelectAll,
  onSelectOne,
  onViewDetail,
  onDeleteOne,
}: VectorDocumentTableProps) {
  const { t } = useTranslation();

  return (
    <div className='overflow-hidden rounded-2xl border border-border/70'>
      <Table className='table-fixed min-w-[980px]'>
        <TableHeader className='bg-muted/30'>
          <TableRow>
            <TableHead className='w-[6%] px-4 py-3'>
              <Checkbox
                checked={docs.length > 0 && selectedIds.size === docs.length}
                onCheckedChange={(checked) => onSelectAll(!!checked)}
                aria-label={t('admin.ai.vector.table.selectAll', 'Select all')}
              />
            </TableHead>
            <TableHead className='w-[16%] px-4 py-3'>
              {t('admin.ai.vector.table.id', 'ID')}
            </TableHead>
            <TableHead className='w-[38%] px-4 py-3'>
              {t('admin.ai.vector.table.content', 'Content')}
            </TableHead>
            <TableHead className='w-[28%] px-4 py-3'>
              {t('admin.ai.vector.table.metadata', 'Metadata')}
            </TableHead>
            <TableHead className='w-[12%] px-4 py-3 text-right'>
              {t('admin.ai.vector.table.actions', 'Actions')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && docs.length === 0 ? (
            ['skeleton-1', 'skeleton-2', 'skeleton-3'].map((key) => (
              <TableRow key={key}>
                <TableCell colSpan={5}>
                  <div className='h-4 animate-pulse rounded bg-muted' />
                </TableCell>
              </TableRow>
            ))
          ) : isError ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className='py-12 text-center text-muted-foreground'
              >
                {t(
                  'admin.ai.vector.table.errorState',
                  'Could not load documents'
                )}
              </TableCell>
            </TableRow>
          ) : docs.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className='py-12 text-center text-muted-foreground'
              >
                {t('common.noData', 'No documents found')}
              </TableCell>
            </TableRow>
          ) : (
            docs.map((doc) => {
              const metadataPreview = JSON.stringify(doc.metadata);

              return (
                <TableRow key={doc.id}>
                  <TableCell className='px-4 py-4 align-top'>
                    <Checkbox
                      checked={selectedIds.has(doc.id)}
                      onCheckedChange={(checked) =>
                        onSelectOne(doc.id, !!checked)
                      }
                      aria-label={t(
                        'admin.ai.vector.table.selectRow',
                        'Select row'
                      )}
                    />
                  </TableCell>
                  <TableCell className='break-all px-4 py-4 align-top font-mono text-xs text-muted-foreground whitespace-normal'>
                    {doc.id}
                  </TableCell>
                  <TableCell className='px-4 py-4 align-top whitespace-normal'>
                    <p className='line-clamp-3 break-words text-sm leading-6'>
                      {formatPreview(doc.contentExcerpt, 180)}
                    </p>
                  </TableCell>
                  <TableCell className='px-4 py-4 align-top whitespace-normal'>
                    <p className='line-clamp-3 break-all font-mono text-xs leading-6 text-muted-foreground'>
                      {formatPreview(metadataPreview, 140)}
                    </p>
                  </TableCell>
                  <TableCell className='px-4 py-4 align-top text-right'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='icon' className='h-8 w-8'>
                          <IconDots className='h-4 w-4' />
                          <span className='sr-only'>
                            {t('admin.ai.vector.table.actions', 'Actions')}
                          </span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuItem onClick={() => onViewDetail(doc)}>
                          <IconEye className='mr-2 h-4 w-4' />
                          {t(
                            'admin.ai.vector.actions.viewDetail',
                            'View detail'
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDeleteOne(doc.id)}
                          className='text-destructive focus:text-destructive'
                        >
                          <IconTrash className='mr-2 h-4 w-4' />
                          {t('admin.ai.vector.actions.delete', 'Delete')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
