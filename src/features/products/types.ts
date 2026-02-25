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

export interface ShoeResponse {
  id: string;
  name: string;
  description: string;
  slug: string;
  material: string;
  gender: string;
  status: string;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  brandId: string;
  brandName: string;
  brandSlug: string;
  price: number;
  imageUrls: string[];
  variants: ShoeVariantResponse[];
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
}

export interface ResponseGeneral<T> {
  message: string;
  code: string;
  data: T;
  timestamp: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
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
