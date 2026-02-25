import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type ReviewStatus } from '@/features/reviews';
import { reviewKeys, mockShoeReviews } from '@/features/reviews';

export const adminReviewKeys = {
  all: ['admin', 'reviews'] as const,
  list: () => [...adminReviewKeys.all, 'list'] as const,
};

export const useAdminReviews = () => {
  return useQuery({
    queryKey: adminReviewKeys.list(),
    queryFn: async () => {
      // Trả về dữ liệu mock thay vì gọi API
      return mockShoeReviews;
    },
  });
};

export const useUpdateReviewStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      reviewId,
      status,
    }: {
      reviewId: string;
      status: ReviewStatus;
    }) => {
      // Giả lập cập nhật thành công
      const review = mockShoeReviews.find((r) => r.id === reviewId);
      if (!review) throw new Error('Review not found');

      return { ...review, status };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminReviewKeys.all });
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewId: string) => {
      // Giả lập xóa thành công
      console.log('Deleting review:', reviewId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminReviewKeys.all });
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
    },
  });
};
