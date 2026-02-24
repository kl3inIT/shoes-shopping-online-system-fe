import type { ProductCardProps } from '@/features/products';
import type { FilterOption } from '@/features/products';

export const brandOptions: FilterOption[] = [
  { value: 'nike', label: 'Nike', count: 15 },
  { value: 'adidas', label: 'Adidas', count: 12 },
  { value: 'puma', label: 'Puma', count: 8 },
  { value: 'new-balance', label: 'New Balance', count: 10 },
  { value: 'converse', label: 'Converse', count: 6 },
  { value: 'vans', label: 'Vans', count: 7 },
  { value: 'jordan', label: 'Jordan', count: 9 },
  { value: 'reebok', label: 'Reebok', count: 5 },
];

export const sizeOptions: FilterOption[] = [
  { value: '36', label: '36' },
  { value: '37', label: '37' },
  { value: '38', label: '38' },
  { value: '39', label: '39' },
  { value: '40', label: '40' },
  { value: '41', label: '41' },
  { value: '42', label: '42' },
  { value: '43', label: '43' },
  { value: '44', label: '44' },
  { value: '45', label: '45' },
];

export const categoryOptions: FilterOption[] = [
  { value: 'running', label: 'Running', count: 20 },
  { value: 'casual', label: 'Casual', count: 25 },
  { value: 'basketball', label: 'Basketball', count: 12 },
  { value: 'skateboarding', label: 'Skateboarding', count: 8 },
  { value: 'training', label: 'Training', count: 15 },
];

export const sortOptions: FilterOption[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'popular', label: 'Most Popular' },
];

export const priceRange = { min: 0, max: 10000000 };
