import { useTranslation } from 'react-i18next';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ChecksPaginationProps {
  page: number; // 0-indexed
  totalPages: number;
  totalElements: number;
  pageSize: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  isFirst: boolean;
  isLast: boolean;
}

export function ChecksPagination({
  page,
  totalPages,
  totalElements,
  pageSize,
  pageSizeOptions = [5, 10, 20],
  onPageChange,
  onPageSizeChange,
  isFirst,
  isLast,
}: ChecksPaginationProps) {
  const { t } = useTranslation();

  if (totalPages <= 0) return null;

  return (
    <div className='flex flex-wrap items-center justify-between gap-3 pt-1'>
      <div className='flex items-center gap-2 text-sm text-muted-foreground'>
        <span>
          {t('admin.ai.checks.pagination.total', '{{count}} records', {
            count: totalElements,
          })}
        </span>
        <span aria-hidden>·</span>
        <div className='flex items-center gap-1.5'>
          <span>{t('admin.ai.checks.pagination.rowsPerPage', 'Rows:')}</span>
          <Select
            value={String(pageSize)}
            onValueChange={(v) => {
              onPageSizeChange(Number(v));
              onPageChange(0);
            }}
          >
            <SelectTrigger className='h-7 w-[64px] text-xs'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((opt) => (
                <SelectItem key={opt} value={String(opt)} className='text-xs'>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Pagination className='w-auto'>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(Math.max(0, page - 1))}
              aria-disabled={isFirst}
              className={isFirst ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
          <PaginationItem>
            <span className='select-none px-4 text-sm text-muted-foreground'>
              {t(
                'admin.ai.checks.pagination.pageOf',
                'Page {{page}} of {{total}}',
                { page: page + 1, total: totalPages }
              )}
            </span>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
              aria-disabled={isLast}
              className={isLast ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
