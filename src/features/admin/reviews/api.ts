import apiClient from '@/features/apiClient';

import type { AdminReviewItem, AdminReviewsQueryParams } from './types';

export type AdminReviewPage = {
  content: AdminReviewItem[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
};

export async function getAdminReviews(
  params?: AdminReviewsQueryParams
): Promise<AdminReviewPage> {
  const response = await apiClient.get<{
    data: AdminReviewPage;
  }>('/api/v1/admin/reviews', { params });
  return response.data.data;
}

export async function toggleAdminReviewVisibility(
  id: string,
  visible: boolean
): Promise<void> {
  await apiClient.patch(`/api/v1/admin/reviews/${id}/visibility`, {
    visible,
  });
}
