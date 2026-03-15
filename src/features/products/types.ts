export interface ShoeVariantResponse {
  id: string;
  shoeId: string;
  size: string;
  color: string;
  quantity: number;
  sku: string;
  imageUrls: string[];
  createdAt: string;
  updatedAt: string;
}

export type ShoeStatus =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'OUT_OF_STOCK'
  | 'DRAFT'
  | 'DISCONTINUED';

export interface ShoeResponse {
  id: string;
  name: string;
  description: string;
  slug: string;
  material: string;
  gender: string;
  status: ShoeStatus;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  brandId: string;
  brandName: string;
  brandSlug: string;
  price: number;
  imageUrls: string[];
  variants: ShoeVariantResponse[];
  avgRating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ShoeStockSummaryResponse {
  total: number;
  selling: number;
  outOfStock: number;
  lowStock: number;
}

export interface ResponseGeneral<T> {
  status: number;
  message: string;
  data: T;
  timestamp: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  pageNumber: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface ShoeVariantRequestDto {
  id?: string | null;
  size: string;
  color: string;
  quantity: number;
  active?: boolean | null;
}

export interface ShoeCreateRequestDto {
  name: string;
  description: string;
  material: string;
  gender: string;
  status: ShoeStatus;
  categoryId: string;
  brandId: string;
  price: number;
  variants: ShoeVariantRequestDto[];
}

export interface ShoeVariantImageUpdateRequestDto {
  variantId: string;
  keepImageUrls?: string[] | null;
}

export interface ShoeUpdateRequestDto extends ShoeCreateRequestDto {
  keepShoeImageUrls?: string[] | null;
  variantImageUpdates?: ShoeVariantImageUpdateRequestDto[] | null;
}

export interface BrandResponse {
  id: string;
  name: string;
  description: string;
  slug: string;
  imageUrl?: string;
}

export interface CategoryResponse {
  id: string;
  name: string;
  description: string;
  slug: string;
  parentId?: string;
}
