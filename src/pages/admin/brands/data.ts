export interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string;
  country: string;
  logoUrl: string;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

export const mockBrands: Brand[] = [
  {
    id: '1',
    name: 'Nike',
    slug: 'nike',
    description: "Just Do It. Nike is the world's leading sportswear brand.",
    country: 'United States',
    logoUrl:
      'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg',
    productCount: 45,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Adidas',
    slug: 'adidas',
    description: 'Impossible Is Nothing. German multinational corporation.',
    country: 'Germany',
    logoUrl:
      'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg',
    productCount: 38,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-12T09:00:00Z',
  },
  {
    id: '3',
    name: 'Puma',
    slug: 'puma',
    description: 'Forever Faster. German multinational corporation.',
    country: 'Germany',
    logoUrl:
      'https://upload.wikimedia.org/wikipedia/en/d/da/Puma_complete_logo.svg',
    productCount: 22,
    createdAt: '2023-02-15T00:00:00Z',
    updatedAt: '2024-01-10T14:00:00Z',
  },
  {
    id: '4',
    name: 'New Balance',
    slug: 'new-balance',
    description: 'Fearlessly Independent Since 1906.',
    country: 'United States',
    logoUrl:
      'https://upload.wikimedia.org/wikipedia/commons/e/ea/New_Balance_logo.svg',
    productCount: 18,
    createdAt: '2023-03-01T00:00:00Z',
    updatedAt: '2024-01-08T11:00:00Z',
  },
  {
    id: '5',
    name: 'Jordan',
    slug: 'jordan',
    description: "Michael Jordan's iconic basketball brand by Nike.",
    country: 'United States',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/3/37/Jumpman_logo.svg',
    productCount: 25,
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2024-01-20T16:00:00Z',
  },
  {
    id: '6',
    name: 'Converse',
    slug: 'converse',
    description: 'American shoe company. Chuck Taylor All Star.',
    country: 'United States',
    logoUrl:
      'https://upload.wikimedia.org/wikipedia/commons/3/30/Converse_logo.svg',
    productCount: 12,
    createdAt: '2023-04-01T00:00:00Z',
    updatedAt: '2024-01-05T08:00:00Z',
  },
];

export const countryOptions = [
  { value: 'United States', label: 'United States' },
  { value: 'Germany', label: 'Germany' },
  { value: 'United Kingdom', label: 'United Kingdom' },
  { value: 'Japan', label: 'Japan' },
  { value: 'Italy', label: 'Italy' },
  { value: 'France', label: 'France' },
];
