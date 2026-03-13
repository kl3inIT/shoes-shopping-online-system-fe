export type AdminReviewModerationItem = {
  createdAt: string;
  id: string;
  rating: number;
  reviewerName: string;
  shoeId: string;
  shoeName: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  updatedAt?: string | null;
};

export type AdminReviewsQueryParams = {
  page?: number;
  rating?: number;
  search?: string;
  size?: number;
  status?: AdminReviewModerationItem['status'];
};
