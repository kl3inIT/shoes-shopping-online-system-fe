import { useTranslation } from 'react-i18next';
import { IconDots, IconEye, IconTrash } from '@tabler/icons-react';
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
    <div className='rounded-lg border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-12'>
              <Checkbox
                checked={docs.length > 0 && selectedIds.size === docs.length}
                onCheckedChange={(checked) => onSelectAll(!!checked)}
                aria-label={t('admin.ai.vector.table.selectAll', 'Select all')}
              />
            </TableHead>
            <TableHead>{t('admin.ai.vector.table.id', 'ID')}</TableHead>
            <TableHead>
              {t('admin.ai.vector.table.content', 'Content')}
            </TableHead>
            <TableHead>
              {t('admin.ai.vector.table.metadata', 'Metadata')}
            </TableHead>
            <TableHead className='text-right'>
              {t('admin.ai.vector.table.actions', 'Actions')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && docs.length === 0 ? (
            <>
              {[0, 1, 2].map((i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5}>
                    <div className='h-4 animate-pulse rounded bg-muted' />
                  </TableCell>
                </TableRow>
              ))}
            </>
          ) : isError ? (
            // Error state — banner above table already shows the message;
            // keep the table shell visible so layout does not collapse
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
            docs.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell>
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
                <TableCell className='font-mono text-xs text-muted-foreground'>
                  {doc.id.substring(0, 8)}...
                </TableCell>
                <TableCell className='max-w-xs text-sm'>
                  {doc.contentExcerpt.substring(0, 60)}
                  {doc.contentExcerpt.length > 60 ? '...' : ''}
                </TableCell>
                <TableCell className='max-w-xs font-mono text-xs text-muted-foreground'>
                  {JSON.stringify(doc.metadata).substring(0, 50)}
                  {JSON.stringify(doc.metadata).length > 50 ? '...' : ''}
                </TableCell>
                <TableCell className='text-right'>
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
                        {t('admin.ai.vector.actions.viewDetail', 'View detail')}
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
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
