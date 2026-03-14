import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from '@tanstack/react-query';

import { createReview, markReviewHelpful } from './api';
import {
  publicReviewsByShoeIdQueryKey,
  publicReviewsByShoeIdQueryOptions,
  reviewEligibilityByShoeIdQueryKey,
  reviewEligibilityByShoeIdQueryOptions,
} from './queryOptions';
import type {
  ReviewEligibilityByShoeDto,
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
