/** Cart item from API GET /api/cart */
export interface CartItemDto {
  id: string;
  shoeId: string;
  shoeVariantId: string;
  shoeName: string;
  shoeSlug: string;
  shoeImage: string | null;
  size: string;
  color: string;
  quantity: number;
  price: number;
  subtotal: number;
  stock: number;
}

/** Response GET /api/cart */
export interface CartResponseDto {
  items: CartItemDto[];
  totalPrice: number;
  totalQuantity: number;
}

/** Body POST /api/cart - either shoeVariantId or (shoeId + size + color) */
export interface AddToCartRequestDto {
  shoeVariantId?: string;
  shoeId?: string;
  size?: string;
  color?: string;
  quantity: number;
}

/** Body PUT /api/cart/:id */
export interface UpdateCartItemRequestDto {
  quantity: number;
}

/** Variant from GET /api/shoes/:id/variants */
export interface ShoeVariantDto {
  id: string;
  shoeId: string;
  size: string;
  color: string;
  quantity: number;
  sku: string;
}
