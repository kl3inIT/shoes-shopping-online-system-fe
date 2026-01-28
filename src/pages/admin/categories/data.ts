export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  parentCategory: {
    id: string;
    name: string;
  } | null;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Running',
    slug: 'running',
    description: 'Performance running shoes for all levels',
    imageUrl:
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400',
    parentCategory: null,
    productCount: 42,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Casual',
    slug: 'casual',
    description: 'Everyday casual sneakers and lifestyle shoes',
    imageUrl:
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400',
    parentCategory: null,
    productCount: 35,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-12T09:00:00Z',
  },
  {
    id: '3',
    name: 'Basketball',
    slug: 'basketball',
    description: 'High-performance basketball shoes',
    imageUrl:
      'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=400',
    parentCategory: null,
    productCount: 28,
    createdAt: '2023-02-15T00:00:00Z',
    updatedAt: '2024-01-10T14:00:00Z',
  },
  {
    id: '4',
    name: 'Training',
    slug: 'training',
    description: 'Cross-training and gym shoes',
    imageUrl:
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400',
    parentCategory: null,
    productCount: 22,
    createdAt: '2023-03-01T00:00:00Z',
    updatedAt: '2024-01-08T11:00:00Z',
  },
  {
    id: '5',
    name: 'Walking',
    slug: 'walking',
    description: 'Comfortable walking shoes for daily use',
    imageUrl: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400',
    parentCategory: null,
    productCount: 18,
    createdAt: '2023-04-01T00:00:00Z',
    updatedAt: '2024-01-05T08:00:00Z',
  },
  {
    id: '6',
    name: 'Trail Running',
    slug: 'trail-running',
    description: 'Off-road running shoes for trails',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    parentCategory: { id: '1', name: 'Running' },
    productCount: 12,
    createdAt: '2023-05-01T00:00:00Z',
    updatedAt: '2024-01-03T16:00:00Z',
  },
  {
    id: '7',
    name: 'Road Running',
    slug: 'road-running',
    description: 'Shoes designed for road and pavement',
    imageUrl:
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400',
    parentCategory: { id: '1', name: 'Running' },
    productCount: 30,
    createdAt: '2023-05-15T00:00:00Z',
    updatedAt: '2024-01-02T10:00:00Z',
  },
];

export const parentCategoryOptions = [
  { value: '', label: 'None (Root Category)' },
  { value: '1', label: 'Running' },
  { value: '2', label: 'Casual' },
  { value: '3', label: 'Basketball' },
  { value: '4', label: 'Training' },
  { value: '5', label: 'Walking' },
];
