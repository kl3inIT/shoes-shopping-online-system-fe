export interface ReviewPublicItemDto {
  id: string;
  shoeVariantId: string;
  authorName: string;
  authorAvatarUrl?: string | null;
  numberStars: number;
  description: string;
  imageUrls: string[];
  createdAt: string;
  helpfulCount: number;
  currentUserVoted: boolean;
}

export interface ReviewPublicListDto {
  avgRating: number;
  reviewCount: number;
  items: ReviewPublicItemDto[];
}

export interface ReviewEligibilityByShoeDto {
  eligible: boolean;
  alreadyReviewed: boolean;
  orderDetailId?: string | null;
  shoeVariantId?: string | null;
}

export interface ReviewResponseDto {
  id: string;
  shoeVariantId: string;
  numberStars: number;
  description: string;
  imageUrls: string[];
  createdAt: string;
  updatedAt: string;
}

export type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Review {
  id: string;
  customerId: string;
  customerName: string;
  shoeVariantId: string;
  shoeName: string;
  variantInfo: string;
  numberStars: number;
  description: string;
  status: ReviewStatus;
  imageUrls: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewRequest {
  shoeVariantId: string;
  numberStars: number;
  description: string;
  imageUrls?: string[];
}
