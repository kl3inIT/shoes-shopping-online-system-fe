import { queryOptions } from '@tanstack/react-query';

import { getPublicReviewsByShoeId, getReviewEligibilityByShoeId } from './api';
import type { ReviewEligibilityByShoeDto, ReviewPublicListDto } from './types';

export const publicReviewsByShoeIdQueryKey = (shoeId: string | null) =>
  ['reviews', 'shoe', shoeId ?? ''] as const;

export const publicReviewsByShoeIdQueryOptions = (shoeId: string | null) =>
  queryOptions<ReviewPublicListDto, Error>({
    queryKey: publicReviewsByShoeIdQueryKey(shoeId),
    queryFn: () => getPublicReviewsByShoeId(shoeId!),
    enabled: !!shoeId,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

export const reviewEligibilityByShoeIdQueryKey = (shoeId: string | null) =>
  ['reviews', 'eligibility', 'shoe', shoeId ?? ''] as const;

export const reviewEligibilityByShoeIdQueryOptions = (shoeId: string | null) =>
  queryOptions<ReviewEligibilityByShoeDto, Error>({
    queryKey: reviewEligibilityByShoeIdQueryKey(shoeId),
    queryFn: () => getReviewEligibilityByShoeId(shoeId!),
    enabled: !!shoeId,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
