/** DTO trả về từ API GET /api/wishlist */
export interface WishlistItemDto {
  wishlistId: string;
  shoeId: string;
  shoeName: string;
  brandName: string;
  price: number;
  mainImageUrl: string | null;
  createdAt: string;
}

/** Params cho GET /api/wishlist — sortBy là property path bên backend (entity). */
export interface WishlistFilterParams {
  sortBy?: 'createdAt' | 'shoe.name' | 'shoe.price';
  sortOrder?: 'asc' | 'desc';
}
