import type { WishlistItemProps } from '@/features/wishlist';

export const mockWishlistItems: Omit<
  WishlistItemProps,
  'onAddToCart' | 'onRemove' | 'onClick'
>[] = [
  {
    id: 'wish-1',
    productId: '1',
    name: 'Nike Air Max 270',
    brand: 'Nike',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    price: 150,
    originalPrice: 180,
    inStock: true,
    addedAt: '2024-01-20T10:30:00Z',
  },
  {
    id: 'wish-2',
    productId: '4',
    name: 'New Balance 990v5',
    brand: 'New Balance',
    image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400',
    price: 185,
    inStock: true,
    addedAt: '2024-01-18T15:45:00Z',
  },
  {
    id: 'wish-3',
    productId: '7',
    name: 'Jordan 1 Retro High',
    brand: 'Jordan',
    image: 'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=400',
    price: 170,
    inStock: false,
    addedAt: '2024-01-15T08:20:00Z',
  },
  {
    id: 'wish-4',
    productId: '3',
    name: 'Puma RS-X',
    brand: 'Puma',
    image: 'https://images.unsplash.com/photo-1608379743498-fa39e1ca79b2?w=400',
    price: 110,
    originalPrice: 130,
    inStock: true,
    addedAt: '2024-01-12T12:00:00Z',
  },
];
