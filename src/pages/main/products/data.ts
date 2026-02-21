import type { ProductCardProps } from '@/features/products';
import type { FilterOption } from '@/features/products';

/** UUID của giày (id 1..8) - khớp với bảng shoes trong DB */
const shoeIds: Record<string, string> = {
  '1': '0a1b2c3d-4e5f-4a6b-8c7d-9e0f1a2b3c4d',
  '2': '1b2c3d4e-5f60-4b7c-8d9e-0f1a2b3c4d5e',
  '3': '2c3d4e5f-6071-4c8d-9e0f-1a2b3c4d5e6f',
  '4': '3d4e5f60-7182-4d9e-0f1a-2b3c4d5e6f70',
  '5': '4e5f6071-8293-4e0f-1a2b-3c4d5e6f7081',
  '6': '5f607182-9394-4f1a-2b3c-4d5e6f708192',
  '7': 'a4f9ef2f-6d2b-4bb6-8b7f-1c2d5f0d7a11',
  '8': 'b7a1f3c4-2f8e-4b5e-9b1e-3a0c1d2e3f44',
};

export const mockProducts: ProductCardProps[] = [
  {
    id: shoeIds['1'],
    name: 'Nike Air Max 270',
    price: 150,
    originalPrice: 180,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    brand: 'Nike',
    isNew: true,
    isSale: true,
    rating: 4.5,
  },
  {
    id: shoeIds['2'],
    name: 'Adidas Ultraboost 22',
    price: 190,
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400',
    brand: 'Adidas',
    isNew: true,
    rating: 4.8,
  },
  {
    id: shoeIds['3'],
    name: 'Puma RS-X',
    price: 110,
    originalPrice: 130,
    image: 'https://images.unsplash.com/photo-1608379743498-fa39e1ca79b2?w=400',
    brand: 'Puma',
    isSale: true,
    rating: 4.2,
  },
  {
    id: shoeIds['4'],
    name: 'New Balance 990v5',
    price: 185,
    image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400',
    brand: 'New Balance',
    rating: 4.7,
  },
  {
    id: shoeIds['5'],
    name: 'Converse Chuck Taylor',
    price: 65,
    image: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=400',
    brand: 'Converse',
    rating: 4.4,
  },
  {
    id: shoeIds['6'],
    name: 'Vans Old Skool',
    price: 70,
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400',
    brand: 'Vans',
    rating: 4.3,
  },
  {
    id: shoeIds['7'],
    name: 'Jordan 1 Retro High',
    price: 170,
    image: 'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=400',
    brand: 'Jordan',
    isNew: true,
    rating: 4.9,
  },
  {
    id: shoeIds['8'],
    name: 'Reebok Classic Leather',
    price: 80,
    originalPrice: 95,
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400',
    brand: 'Reebok',
    isSale: true,
    rating: 4.1,
  },
];

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

export const priceRange = { min: 0, max: 500 };
