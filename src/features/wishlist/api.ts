import type { ApiSuccessResponse } from '@/types';
import type { WishlistFilterParams, WishlistItemDto } from './types';
import type { WishlistItemProps } from './components/WishlistItem';
import apiClient from '@/features/apiClient';

export async function getWishlist(
  params?: WishlistFilterParams
): Promise<WishlistItemDto[]> {
  const response = await apiClient.get<ApiSuccessResponse<WishlistItemDto[]>>(
    '/api/wishlist',
    { params }
  );
  return response.data.data;
}

export async function addToWishlist(shoeId: string): Promise<WishlistItemDto> {
  const response = await apiClient.post<ApiSuccessResponse<WishlistItemDto>>(
    '/api/wishlist',
    { shoeId }
  );
  return response.data.data;
}

export async function removeFromWishlist(shoeId: string): Promise<void> {
  await apiClient.delete(`/api/wishlist/${shoeId}`);
}

/** Map DTO từ API sang props cho WishlistItem (để dùng với WishlistGrid). */
export function mapWishlistDtoToItemProps(
  dto: WishlistItemDto
): Omit<WishlistItemProps, 'onRemove' | 'onClick'> {
  return {
    id: dto.shoeId,
    productId: dto.shoeId,
    name: dto.shoeName,
    brand: dto.brandName,
    image: dto.mainImageUrl ?? '',
    price: Number(dto.price),
    inStock: true,
    addedAt: dto.createdAt,
  };
}
