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
  type Review,
  type ReviewStatus,
} from '@/features/admin/reviews';

import { mockReviews, statusOptions, ratingOptions } from './data';

export default function AdminReviewsPage() {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState(mockReviews);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

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

  const handleViewDetails = (review: Review) => {
    setSelectedReview(review);
    setDetailDialogOpen(true);
  };

  const handleUpdateStatus = (reviewId: string, newStatus: ReviewStatus) => {
    setReviews((prev) =>
      prev.map((review) =>
        review.id === reviewId
          ? {
              ...review,
              status: newStatus,
              updatedAt: new Date().toISOString(),
            }
          : review
      )
    );
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
        <ReviewTable
          reviews={filteredReviews}
          onViewDetails={handleViewDetails}
          onUpdateStatus={handleUpdateStatus}
        />
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
