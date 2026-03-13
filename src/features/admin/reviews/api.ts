import apiClient from '@/features/apiClient';

import type {
  AdminReviewModerationItem,
  AdminReviewsQueryParams,
} from './types';

export async function getAdminReviews(
  _params?: AdminReviewsQueryParams
): Promise<AdminReviewModerationItem[]> {
  // TODO: Confirm moderation list endpoint and mutation contract before enabling this query.
  const response =
    await apiClient.get<AdminReviewModerationItem[]>('/api/admin/reviews');
  return response.data;
}
