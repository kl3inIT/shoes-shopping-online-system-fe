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
