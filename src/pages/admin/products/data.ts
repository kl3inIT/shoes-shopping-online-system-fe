export type ProductStatus =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'OUT_OF_STOCK'
  | 'DRAFT'
  | 'DISCONTINUED';
export type Gender = 'MEN' | 'WOMEN' | 'UNISEX';

export interface ProductVariant {
  id: string;
  sku: string;
  size: string;
  color: string;
  price: number;
  stockQuantity: number;
  status: 'AVAILABLE' | 'OUT_OF_STOCK' | 'DISCONTINUED';
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: {
    id: string;
    name: string;
  };
  category: {
    id: string;
    name: string;
  };
  gender: Gender;
  material: string;
  description: string;
  imageUrl: string;
  basePrice: number;
  status: ProductStatus;
  variants: ProductVariant[];
  reviewCount: number;
  averageRating: number;
  createdAt: string;
  updatedAt: string;
}

export const brandOptions = [
  { value: '1', label: 'Nike' },
  { value: '2', label: 'Adidas' },
  { value: '3', label: 'Puma' },
  { value: '4', label: 'New Balance' },
  { value: '5', label: 'Jordan' },
];

export const categoryOptions = [
  { value: '1', label: 'Running' },
  { value: '2', label: 'Casual' },
  { value: '3', label: 'Basketball' },
  { value: '4', label: 'Training' },
];

export const genderOptions = [
  { value: 'MEN', label: 'Men' },
  { value: 'WOMEN', label: 'Women' },
  { value: 'UNISEX', label: 'Unisex' },
];

export const statusOptions = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
  { value: 'OUT_OF_STOCK', label: 'Out of Stock' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'DISCONTINUED', label: 'Discontinued' },
];
