import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from '@tanstack/react-query';

import {
  createReview,
  getReviewEligibility,
  markReviewHelpful,
  updateReview,
} from './api';
import {
  publicReviewsByShoeIdQueryKey,
  publicReviewsByShoeIdQueryOptions,
  reviewEligibilityByShoeIdQueryKey,
  reviewEligibilityByShoeIdQueryOptions,
} from './queryOptions';
import type {
  ReviewEligibilityByShoeDto,
  ReviewEligibilityDto,
  ReviewPublicListDto,
  ReviewResponseDto,
} from './types';

export function usePublicReviewsByShoeId(
  shoeId?: string
): UseQueryResult<ReviewPublicListDto, Error> {
  return useQuery(publicReviewsByShoeIdQueryOptions(shoeId ?? null));
}

export function useReviewEligibilityByShoeId(
  shoeId?: string,
  enabled = true
): UseQueryResult<ReviewEligibilityByShoeDto, Error> {
  return useQuery({
    ...reviewEligibilityByShoeIdQueryOptions(shoeId ?? null),
    enabled: enabled && !!shoeId,
  });
}

export function useReviewEligibility(
  orderDetailId: string | null,
  shoeVariantId: string | null,
  enabled = true
): UseQueryResult<ReviewEligibilityDto, Error> {
  return useQuery({
    queryKey: ['review-eligibility', orderDetailId, shoeVariantId],
    queryFn: () => getReviewEligibility(orderDetailId!, shoeVariantId!),
    enabled: enabled && !!orderDetailId && !!shoeVariantId,
  });
}

export function useCreateReviewMutation(shoeId?: string) {
  const queryClient = useQueryClient();
  return useMutation<
    ReviewResponseDto,
    Error,
    Parameters<typeof createReview>[0]
  >({
    mutationFn: createReview,
    onSuccess: async () => {
      if (shoeId) {
        await queryClient.invalidateQueries({
          queryKey: publicReviewsByShoeIdQueryKey(shoeId),
        });
        await queryClient.invalidateQueries({
          queryKey: reviewEligibilityByShoeIdQueryKey(shoeId),
        });
      } else {
        await queryClient.invalidateQueries({ queryKey: ['reviews'] });
      }
    },
  });
}

export function useUpdateReviewMutation(shoeId?: string) {
  const queryClient = useQueryClient();

  return useMutation<
    ReviewResponseDto,
    Error,
    Parameters<typeof updateReview>[0]
  >({
    mutationFn: updateReview,
    onSuccess: async () => {
      if (shoeId) {
        await queryClient.invalidateQueries({
          queryKey: publicReviewsByShoeIdQueryKey(shoeId),
        });
        await queryClient.invalidateQueries({
          queryKey: reviewEligibilityByShoeIdQueryKey(shoeId),
        });
      } else {
        await queryClient.invalidateQueries({ queryKey: ['reviews'] });
      }
    },
  });
}

export function useMarkReviewHelpfulMutation(shoeId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: string) => markReviewHelpful(reviewId),
    onSuccess: () => {
      if (shoeId) {
        void queryClient.invalidateQueries({
          queryKey: publicReviewsByShoeIdQueryKey(shoeId),
        });
      } else {
        void queryClient.invalidateQueries({ queryKey: ['reviews'] });
      }
    },
  });
}
