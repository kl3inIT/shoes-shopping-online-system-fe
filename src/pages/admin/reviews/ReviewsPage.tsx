import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconSearch } from '@tabler/icons-react';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  ReviewTable,
  ReviewStatsCards,
  ReviewDetailDialog,
  useAdminReviews,
  useUpdateReviewStatus,
  useDeleteReview,
  type AdminReviewItem,
} from '@/features/admin/reviews';
import { type ReviewStatus } from '@/features/reviews';

import { statusOptions, ratingOptions } from './data';
import { toast } from 'sonner';

export default function AdminReviewsPage() {
  const { t } = useTranslation();
  const { data: apiReviews = [], isLoading } = useAdminReviews();
  const updateStatusMutation = useUpdateReviewStatus();
  const deleteReviewMutation = useDeleteReview();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<AdminReviewItem | null>(
    null
  );

  // Transform API reviews to local Review format
  const reviews: AdminReviewItem[] = apiReviews.map((r: any) => ({
    id: r.id,
    customer: {
      id: r.customerId,
      name: r.customerName,
      email: '', // Backend hiện chưa trả về email trong ReviewResponse
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${r.customerName}`,
    },
    product: {
      id: r.shoeVariantId,
      name: r.shoeName,
      imageUrl:
        r.imageUrls?.[0] ||
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    },
    rating: r.numberStars,
    comment: r.description,
    status: r.status,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  }));

  // Filter reviews
  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || review.status === statusFilter;
    const matchesRating =
      ratingFilter === 'all' || review.rating === Number(ratingFilter);
    return matchesSearch && matchesStatus && matchesRating;
  });

  const stats = {
    total: reviews.length,
    pending: reviews.filter((r) => r.status === 'PENDING').length,
    approved: reviews.filter((r) => r.status === 'APPROVED').length,
    rejected: reviews.filter((r) => r.status === 'REJECTED').length,
    avgRating:
      reviews.length > 0
        ? (
            reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          ).toFixed(1)
        : '0',
  };

  const handleViewDetails = (review: AdminReviewItem) => {
    setSelectedReview(review);
    setDetailDialogOpen(true);
  };

  const handleUpdateStatus = (reviewId: string, newStatus: ReviewStatus) => {
    updateStatusMutation.mutate(
      { reviewId, status: newStatus },
      {
        onSuccess: () => {
          toast.success(t('admin.reviews.updateSuccess'));
          if (selectedReview?.id === reviewId) {
            setDetailDialogOpen(false);
          }
        },
        onError: () => {
          toast.error(t('admin.reviews.updateError'));
        },
      }
    );
  };

  const handleDeleteReview = (reviewId: string) => {
    if (window.confirm(t('admin.reviews.deleteConfirm'))) {
      deleteReviewMutation.mutate(reviewId, {
        onSuccess: () => {
          toast.success(t('admin.reviews.deleteSuccess'));
        },
        onError: () => {
          toast.error(t('admin.reviews.deleteError'));
        },
      });
    }
  };

  return (
    <div className='flex flex-col gap-4 py-4'>
      {/* Header */}
      <div className='flex items-center justify-between px-4 lg:px-6'>
        <div>
          <h1 className='text-2xl font-bold'>{t('admin.reviews.title')}</h1>
          <p className='text-muted-foreground'>
            {t('admin.reviews.subtitle', { count: filteredReviews.length })}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='px-4 lg:px-6'>
        <ReviewStatsCards {...stats} />
      </div>

      {/* Filters */}
      <div className='flex flex-wrap items-center gap-4 px-4 lg:px-6'>
        <div className='relative flex-1 min-w-[200px]'>
          <IconSearch className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
          <Input
            placeholder={t('admin.reviews.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pl-10'
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className='w-[150px]'>
            <SelectValue placeholder={t('admin.reviews.filterStatus')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>
              {t('admin.reviews.allStatuses')}
            </SelectItem>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={ratingFilter} onValueChange={setRatingFilter}>
          <SelectTrigger className='w-[150px]'>
            <SelectValue placeholder={t('admin.reviews.filterRating')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>{t('admin.reviews.allRatings')}</SelectItem>
            {ratingOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className='px-4 lg:px-6'>
        {isLoading ? (
          <div className='flex h-64 items-center justify-center'>
            <p>{t('common.loading')}</p>
          </div>
        ) : (
          <ReviewTable
            reviews={filteredReviews}
            onViewDetails={handleViewDetails}
            onUpdateStatus={handleUpdateStatus}
            onDelete={handleDeleteReview}
          />
        )}
      </div>

      {/* Review Detail Dialog */}
      <ReviewDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        review={selectedReview}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}
