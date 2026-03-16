import { Fragment, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  pageSizeOptions?: number[];
  isFirst?: boolean;
  isLast?: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

function getVisiblePages(page: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index);
  }

  const pages = new Set<number>([0, totalPages - 1, page - 1, page, page + 1]);
  return Array.from(pages)
    .filter((value) => value >= 0 && value < totalPages)
    .sort((a, b) => a - b);
}

export function PaginationControls({
  page,
  totalPages,
  totalElements,
  pageSize,
  pageSizeOptions = [10, 20, 40],
  isFirst = page <= 0,
  isLast = totalPages <= 1 || page >= totalPages - 1,
  onPageChange,
  onPageSizeChange,
}: PaginationControlsProps) {
  const { t } = useTranslation();

  const visiblePages = useMemo(
    () => getVisiblePages(page, totalPages),
    [page, totalPages]
  );

  if (totalPages <= 0) {
    return null;
  }

  return (
    <div className='flex flex-col gap-3 rounded-xl border bg-muted/20 px-4 py-3 md:flex-row md:items-center md:justify-between'>
      <div className='flex flex-wrap items-center gap-3 text-sm text-muted-foreground'>
        <span>
          {t('common.pagination.total', '{{count}} records', {
            count: totalElements,
          })}
        </span>
        <div className='flex items-center gap-2'>
          <span>{t('common.pagination.rowsPerPage', 'Rows per page')}</span>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger className='h-8 w-[84px]'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((option) => (
                <SelectItem key={option} value={String(option)}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='flex flex-wrap items-center gap-3 md:ml-auto'>
        <span className='text-sm text-muted-foreground'>
          {t('common.pagination.pageOf', 'Page {{page}} of {{total}}', {
            page: page + 1,
            total: totalPages,
          })}
        </span>
        <Pagination className='mx-0 w-auto'>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink
                href='#'
                size='default'
                aria-label={t(
                  'common.pagination.previousAria',
                  'Go to previous page'
                )}
                onClick={(event) => {
                  event.preventDefault();
                  if (!isFirst) {
                    onPageChange(Math.max(0, page - 1));
                  }
                }}
                className={isFirst ? 'pointer-events-none opacity-50' : ''}
              >
                {t('common.pagination.previous', 'Previous')}
              </PaginationLink>
            </PaginationItem>

            {visiblePages.map((pageNumber, index) => {
              const previousPage = visiblePages[index - 1];
              const showEllipsis =
                previousPage !== undefined && pageNumber - previousPage > 1;

              return (
                <Fragment key={pageNumber}>
                  {showEllipsis ? (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : null}
                  <PaginationItem>
                    <PaginationLink
                      href='#'
                      isActive={pageNumber === page}
                      onClick={(event) => {
                        event.preventDefault();
                        onPageChange(pageNumber);
                      }}
                    >
                      {pageNumber + 1}
                    </PaginationLink>
                  </PaginationItem>
                </Fragment>
              );
            })}

            <PaginationItem>
              <PaginationLink
                href='#'
                size='default'
                aria-label={t('common.pagination.nextAria', 'Go to next page')}
                onClick={(event) => {
                  event.preventDefault();
                  if (!isLast) {
                    onPageChange(Math.min(totalPages - 1, page + 1));
                  }
                }}
                className={isLast ? 'pointer-events-none opacity-50' : ''}
              >
                {t('common.pagination.next', 'Next')}
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
