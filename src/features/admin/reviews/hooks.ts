import { useQuery } from '@tanstack/react-query';

import { getAdminReviews } from './api';
import type { AdminReviewsQueryParams } from './types';

export function useAdminReviews(_params?: AdminReviewsQueryParams) {
  return useQuery({
    queryKey: ['admin', 'reviews', _params ?? {}],
    queryFn: () => getAdminReviews(_params),
    enabled: false,
  });
}
