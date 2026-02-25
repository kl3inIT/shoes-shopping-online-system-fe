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
