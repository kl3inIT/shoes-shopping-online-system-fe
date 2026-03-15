import type { ApiSuccessResponse } from '@/types';
import type {
  CartResponseDto,
  CartItemDto,
  AddToCartRequestDto,
  UpdateCartItemRequestDto,
  ShoeVariantDto,
} from './types';
import apiClient from '@/features/apiClient';

export async function getShoeVariants(
  shoeId: string
): Promise<ShoeVariantDto[]> {
  const response = await apiClient.get<ApiSuccessResponse<ShoeVariantDto[]>>(
    `/api/v1/shoes/${shoeId}/variants`
  );
  return response.data.data;
}

export async function getCart(): Promise<CartResponseDto> {
  const response =
    await apiClient.get<ApiSuccessResponse<CartResponseDto>>('/api/v1/cart');
  return response.data.data;
}

export async function addToCart(
  body: AddToCartRequestDto
): Promise<CartResponseDto> {
  const response = await apiClient.post<ApiSuccessResponse<CartResponseDto>>(
    '/api/v1/cart',
    body
  );
  return response.data.data;
}

export async function updateCartItem(
  cartItemId: string,
  body: UpdateCartItemRequestDto
): Promise<CartResponseDto> {
  const response = await apiClient.put<ApiSuccessResponse<CartResponseDto>>(
    `/api/v1/cart/${cartItemId}`,
    body
  );
  return response.data.data;
}

export async function removeCartItem(cartItemId: string): Promise<void> {
  await apiClient.delete(`/api/v1/cart/${cartItemId}`);
}

export async function clearCart(): Promise<void> {
  await apiClient.delete('/api/v1/cart');
}

/** Map CartItemDto to CartItemProps (for CartPage). */
export function mapCartItemDtoToProps(
  dto: CartItemDto
): Omit<
  import('./components/CartItem').CartItemProps,
  'onQuantityChange' | 'onRemove' | 'onClick'
> {
  return {
    id: dto.id,
    productId: dto.shoeId,
    name: dto.shoeName,
    brand: '',
    image: dto.shoeImage ?? '',
    price: Number(dto.price),
    size: dto.size,
    color: dto.color,
    quantity: Number(dto.quantity),
    maxQuantity: Math.min(dto.stock, 99),
  };
}
