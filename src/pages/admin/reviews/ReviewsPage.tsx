import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ReviewStatsCards } from '@/features/admin/reviews/components/ReviewStatsCards';
import {
  ReviewTable,
  type AdminReviewTableItem,
} from '@/features/admin/reviews/components/ReviewTable';
import { ReviewDetailDialog } from '@/features/admin/reviews/components/ReviewDetailDialog';
import {
  useAdminReviews,
  useToggleAdminReviewVisibility,
} from '@/features/admin/reviews/hooks';
import type {
  AdminReviewItem,
  AdminReviewsQueryParams,
} from '@/features/admin/reviews/types';

export default function AdminReviewsPage() {
  const { t } = useTranslation();
  const [params, setParams] = useState<AdminReviewsQueryParams>({
    page: 0,
    size: 10,
    visible: undefined,
    fromDate: undefined,
    toDate: undefined,
  });
  const { data, isLoading } = useAdminReviews(params);
  const toggleVisibility = useToggleAdminReviewVisibility();

  const [selected, setSelected] = useState<AdminReviewItem | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const reviews = data?.content ?? [];
  const total = data?.totalElements ?? reviews.length;
  const visibleCount = reviews.filter((r) => r.visible).length;
  const hiddenCount = reviews.length - visibleCount;
  const avgRating =
    total === 0
      ? '0.0'
      : (reviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1);

  const mapToTableItem = (r: AdminReviewItem): AdminReviewTableItem => ({
    id: r.id,
    customer: {
      id: '',
      name: r.customerName,
      email: r.customerEmail ?? '',
      avatarUrl: r.customerAvatarUrl ?? '',
    },
    product: {
      id: '',
      name: r.shoeName ?? '',
      imageUrl: r.shoeImageUrl ?? '',
    },
    order: undefined,
    rating: r.rating,
    comment: r.comment,
    visible: r.visible,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt ?? r.createdAt,
  });

  const handleToggleVisibility = (id: string, visible: boolean) => {
    toggleVisibility.mutate({ id, visible });
  };

  return (
    <div className='flex flex-col gap-4 py-4'>
      <div className='flex items-center justify-between px-4 lg:px-6'>
        <div>
          <h1 className='text-2xl font-bold'>{t('admin.reviews.title')}</h1>
          <p className='text-muted-foreground'>
            {t('admin.reviews.subtitle', { count: total })}
          </p>
        </div>
      </div>

      <div className='px-4 lg:px-6 space-y-4'>
        <ReviewStatsCards
          total={total}
          approved={visibleCount}
          rejected={hiddenCount}
          avgRating={avgRating}
        />

        <div className='flex items-center justify-between gap-4'>
          <div className='flex items-center gap-2'>
            <span className='text-sm text-muted-foreground'>
              {t('admin.reviews.filter.visibility', 'Trạng thái hiển thị')}:
            </span>
            <select
              className='h-8 rounded-md border bg-background px-2 text-sm'
              value={
                params.visible === undefined
                  ? 'all'
                  : params.visible
                    ? 'visible'
                    : 'hidden'
              }
              onChange={(e) => {
                const v = e.target.value;
                setParams((prev) => ({
                  ...prev,
                  page: 0,
                  visible:
                    v === 'all' ? undefined : v === 'visible' ? true : false,
                }));
              }}
            >
              <option value='all'>
                {t('admin.reviews.filter.all', 'Tất cả')}
              </option>
              <option value='visible'>
                {t('admin.reviews.visibility.visible')}
              </option>
              <option value='hidden'>
                {t('admin.reviews.visibility.hidden')}
              </option>
            </select>
          </div>

          <div className='flex items-center gap-2'>
            <span className='text-sm text-muted-foreground'>
              {t('admin.reviews.filter.date', 'Ngày cập nhật')}:
            </span>
            <input
              type='date'
              className='h-8 rounded-md border bg-background px-2 text-sm'
              value={params.fromDate ?? ''}
              onChange={(e) =>
                setParams((prev) => ({
                  ...prev,
                  page: 0,
                  fromDate: e.target.value || undefined,
                }))
              }
            />
            <span>-</span>
            <input
              type='date'
              className='h-8 rounded-md border bg-background px-2 text-sm'
              value={params.toDate ?? ''}
              onChange={(e) =>
                setParams((prev) => ({
                  ...prev,
                  page: 0,
                  toDate: e.target.value || undefined,
                }))
              }
            />
          </div>

          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
            <button
              type='button'
              className='rounded border px-2 py-1 disabled:opacity-50'
              disabled={params.page === 0}
              onClick={() =>
                setParams((prev) => ({
                  ...prev,
                  page: Math.max(0, (prev.page ?? 0) - 1),
                }))
              }
            >
              {t('common.back', 'Back')}
            </button>
            <span>
              {t('orders.timeline.pageOf', 'Trang {{page}} / {{total}}', {
                page: (data?.number ?? 0) + 1,
                total: data?.totalPages ?? 1,
              })}
            </span>
            <button
              type='button'
              className='rounded border px-2 py-1 disabled:opacity-50'
              disabled={data ? data.number + 1 >= data.totalPages : true}
              onClick={() =>
                setParams((prev) => ({
                  ...prev,
                  page: (prev.page ?? 0) + 1,
                }))
              }
            >
              {t('common.next', 'Next')}
            </button>
          </div>
        </div>

        {!isLoading && (
          <ReviewTable
            reviews={reviews.map(mapToTableItem)}
            onViewDetails={(row) => {
              const src = reviews.find((r) => r.id === row.id) ?? null;
              setSelected(src);
              setDetailOpen(true);
            }}
            onToggleVisibility={handleToggleVisibility}
          />
        )}

        <ReviewDetailDialog
          open={detailOpen}
          onOpenChange={setDetailOpen}
          review={
            selected
              ? mapToTableItem({
                  ...selected,
                })
              : null
          }
          onToggleVisibility={handleToggleVisibility}
        />
      </div>
    </div>
  );
}
