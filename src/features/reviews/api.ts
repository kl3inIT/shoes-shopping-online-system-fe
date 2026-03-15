import apiClient from '@/features/apiClient';
import type { ApiSuccessResponse } from '@/types';
import type {
  ReviewEligibilityByShoeDto,
  ReviewEligibilityDto,
  ReviewPublicListDto,
  ReviewResponseDto,
} from './types';

export async function getPublicReviewsByShoeId(
  shoeId: string,
  params: { page?: number; size?: number } = {}
): Promise<ReviewPublicListDto> {
  const response = await apiClient.get<ApiSuccessResponse<ReviewPublicListDto>>(
    `/api/v1/reviews/shoe/${shoeId}`,
    { params }
  );
  return response.data.data;
}

export async function markReviewHelpful(reviewId: string): Promise<void> {
  await apiClient.post<ApiSuccessResponse<unknown>>(
    `/api/v1/reviews/${reviewId}/helpful`,
    undefined
  );
}

export async function getReviewEligibilityByShoeId(
  shoeId: string
): Promise<ReviewEligibilityByShoeDto> {
  const response = await apiClient.get<
    ApiSuccessResponse<ReviewEligibilityByShoeDto>
  >(`/api/v1/reviews/eligibility/shoe/${shoeId}`);
  return response.data.data;
}

export async function getReviewEligibility(
  orderDetailId: string,
  shoeVariantId: string
): Promise<ReviewEligibilityDto> {
  const response = await apiClient.get<
    ApiSuccessResponse<ReviewEligibilityDto>
  >('/api/v1/reviews/eligibility', {
    params: { orderDetailId, shoeVariantId },
  });
  return response.data.data;
}

export async function createReview(payload: {
  orderDetailId: string;
  shoeVariantId: string;
  numberStars: number;
  description: string;
  images?: File[];
}): Promise<ReviewResponseDto> {
  const { images, ...request } = payload;
  const formData = new FormData();

  formData.append(
    'request',
    new Blob([JSON.stringify(request)], { type: 'application/json' })
  );

  (images ?? []).forEach((file) => {
    formData.append('images', file);
  });

  const response = await apiClient.post<ApiSuccessResponse<ReviewResponseDto>>(
    '/api/v1/reviews',
    formData
  );

  return response.data.data;
}

export async function updateReview(payload: {
  reviewId: string;
  numberStars: number;
  description: string;
  images?: File[];
  keepImageUrls?: string[];
}): Promise<ReviewResponseDto> {
  const { reviewId, images, ...request } = payload;
  const formData = new FormData();

  formData.append(
    'request',
    new Blob([JSON.stringify(request)], { type: 'application/json' })
  );

  (images ?? []).forEach((file) => {
    formData.append('images', file);
  });

  const response = await apiClient.put<ApiSuccessResponse<ReviewResponseDto>>(
    `/api/v1/reviews/${reviewId}`,
    formData
  );

  return response.data.data;
}
