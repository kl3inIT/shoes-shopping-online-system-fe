export type AdminReviewItem = {
  id: string;
  rating: number;
  comment: string;
  visible: boolean;
  createdAt: string;
  updatedAt: string | null;
  customerName: string;
  customerEmail: string | null;
  customerAvatarUrl: string | null;
  shoeName: string | null;
  shoeImageUrl: string | null;
};

export type AdminReviewsQueryParams = {
  page?: number;
  size?: number;
  visible?: boolean;
  fromDate?: string;
  toDate?: string;
};
