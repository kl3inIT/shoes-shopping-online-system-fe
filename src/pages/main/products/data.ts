import type { ProductCardProps } from '@/features/products';
import type { FilterOption } from '@/features/products';

export const mockProducts: ProductCardProps[] = [
  {
    id: '1',
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
    id: '2',
    name: 'Adidas Ultraboost 22',
    price: 190,
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400',
    brand: 'Adidas',
    isNew: true,
    rating: 4.8,
  },
  {
    id: '3',
    name: 'Puma RS-X',
    price: 110,
    originalPrice: 130,
    image: 'https://images.unsplash.com/photo-1608379743498-fa39e1ca79b2?w=400',
    brand: 'Puma',
    isSale: true,
    rating: 4.2,
  },
  {
    id: '4',
    name: 'New Balance 990v5',
    price: 185,
    image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400',
    brand: 'New Balance',
    rating: 4.7,
  },
  {
    id: '5',
    name: 'Converse Chuck Taylor',
    price: 65,
    image: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=400',
    brand: 'Converse',
    rating: 4.4,
  },
  {
    id: '6',
    name: 'Vans Old Skool',
    price: 70,
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400',
    brand: 'Vans',
    rating: 4.3,
  },
  {
    id: '7',
    name: 'Jordan 1 Retro High',
    price: 170,
    image: 'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=400',
    brand: 'Jordan',
    isNew: true,
    rating: 4.9,
  },
  {
    id: '8',
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
