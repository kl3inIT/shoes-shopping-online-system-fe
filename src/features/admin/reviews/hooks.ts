import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getAdminReviews, toggleAdminReviewVisibility } from './api';
import type { AdminReviewsQueryParams } from './types';

export function useAdminReviews(params?: AdminReviewsQueryParams) {
  return useQuery({
    queryKey: ['admin', 'reviews', params ?? {}],
    queryFn: () => getAdminReviews(params),
  });
}

export function useToggleAdminReviewVisibility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, visible }: { id: string; visible: boolean }) =>
      toggleAdminReviewVisibility(id, visible),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] });
    },
  });
}
