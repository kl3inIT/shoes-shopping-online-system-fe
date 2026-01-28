export type ProductStatus = 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK';
export type Gender = 'MEN' | 'WOMEN' | 'UNISEX' | 'KIDS';

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

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Nike Air Max 270',
    slug: 'nike-air-max-270',
    brand: { id: '1', name: 'Nike' },
    category: { id: '1', name: 'Running' },
    gender: 'MEN',
    material: 'Mesh, Synthetic',
    description:
      'The Nike Air Max 270 delivers visible cushioning under every step.',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    basePrice: 150,
    status: 'ACTIVE',
    variants: [
      {
        id: 'v1',
        sku: 'NAM270-BLK-40',
        size: '40',
        color: 'Black',
        price: 150,
        stockQuantity: 25,
        status: 'AVAILABLE',
      },
      {
        id: 'v2',
        sku: 'NAM270-BLK-41',
        size: '41',
        color: 'Black',
        price: 150,
        stockQuantity: 18,
        status: 'AVAILABLE',
      },
      {
        id: 'v3',
        sku: 'NAM270-WHT-40',
        size: '40',
        color: 'White',
        price: 150,
        stockQuantity: 0,
        status: 'OUT_OF_STOCK',
      },
    ],
    reviewCount: 124,
    averageRating: 4.5,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
  },
  {
    id: '2',
    name: 'Adidas Ultraboost 22',
    slug: 'adidas-ultraboost-22',
    brand: { id: '2', name: 'Adidas' },
    category: { id: '1', name: 'Running' },
    gender: 'UNISEX',
    material: 'Primeknit, Boost',
    description: 'Experience incredible energy return with the Ultraboost 22.',
    imageUrl:
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400',
    basePrice: 190,
    status: 'ACTIVE',
    variants: [
      {
        id: 'v4',
        sku: 'AUB22-BLK-39',
        size: '39',
        color: 'Black',
        price: 190,
        stockQuantity: 30,
        status: 'AVAILABLE',
      },
      {
        id: 'v5',
        sku: 'AUB22-BLK-40',
        size: '40',
        color: 'Black',
        price: 190,
        stockQuantity: 22,
        status: 'AVAILABLE',
      },
    ],
    reviewCount: 89,
    averageRating: 4.8,
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-18T11:00:00Z',
  },
  {
    id: '3',
    name: 'Puma RS-X',
    slug: 'puma-rs-x',
    brand: { id: '3', name: 'Puma' },
    category: { id: '2', name: 'Casual' },
    gender: 'UNISEX',
    material: 'Mesh, Leather',
    description: 'Bold design meets comfort with the Puma RS-X.',
    imageUrl:
      'https://images.unsplash.com/photo-1608379743498-fa39e1ca79b2?w=400',
    basePrice: 110,
    status: 'INACTIVE',
    variants: [
      {
        id: 'v6',
        sku: 'PRSX-WHT-42',
        size: '42',
        color: 'White',
        price: 110,
        stockQuantity: 15,
        status: 'AVAILABLE',
      },
    ],
    reviewCount: 45,
    averageRating: 4.2,
    createdAt: '2024-01-05T14:00:00Z',
    updatedAt: '2024-01-12T09:30:00Z',
  },
  {
    id: '4',
    name: 'New Balance 990v5',
    slug: 'new-balance-990v5',
    brand: { id: '4', name: 'New Balance' },
    category: { id: '1', name: 'Running' },
    gender: 'MEN',
    material: 'Pigskin, Mesh',
    description: 'Made in USA. Premium craftsmanship meets performance.',
    imageUrl: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400',
    basePrice: 185,
    status: 'ACTIVE',
    variants: [
      {
        id: 'v7',
        sku: 'NB990-GRY-43',
        size: '43',
        color: 'Grey',
        price: 185,
        stockQuantity: 8,
        status: 'AVAILABLE',
      },
      {
        id: 'v8',
        sku: 'NB990-GRY-44',
        size: '44',
        color: 'Grey',
        price: 185,
        stockQuantity: 12,
        status: 'AVAILABLE',
      },
    ],
    reviewCount: 67,
    averageRating: 4.7,
    createdAt: '2024-01-08T08:00:00Z',
    updatedAt: '2024-01-15T16:00:00Z',
  },
  {
    id: '5',
    name: 'Jordan 1 Retro High',
    slug: 'jordan-1-retro-high',
    brand: { id: '5', name: 'Jordan' },
    category: { id: '3', name: 'Basketball' },
    gender: 'UNISEX',
    material: 'Full-grain Leather',
    description: 'The shoe that started it all. Iconic style since 1985.',
    imageUrl:
      'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=400',
    basePrice: 170,
    status: 'ACTIVE',
    variants: [
      {
        id: 'v9',
        sku: 'J1RH-RED-41',
        size: '41',
        color: 'Red/Black',
        price: 170,
        stockQuantity: 5,
        status: 'AVAILABLE',
      },
      {
        id: 'v10',
        sku: 'J1RH-RED-42',
        size: '42',
        color: 'Red/Black',
        price: 170,
        stockQuantity: 0,
        status: 'OUT_OF_STOCK',
      },
    ],
    reviewCount: 203,
    averageRating: 4.9,
    createdAt: '2024-01-02T12:00:00Z',
    updatedAt: '2024-01-22T10:00:00Z',
  },
];

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
  { value: 'KIDS', label: 'Kids' },
];

export const statusOptions = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
  { value: 'OUT_OF_STOCK', label: 'Out of Stock' },
];
