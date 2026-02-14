import type { ProductDetailProps } from '@/features/products';
import type { ReviewCardProps } from '@/features/reviews';

export const mockProductDetail: Omit<
  ProductDetailProps,
  'onAddToCart' | 'onAddToWishlist' | 'onShare'
> = {
  id: '1',
  name: 'Nike Air Max 270',
  brand: 'Nike',
  price: 150,
  originalPrice: 180,
  description:
    'The Nike Air Max 270 delivers visible cushioning under every step. Updated for modern comfort, it nods to the original 1991 Air Max 180 with its exaggerated tongue top and heritage tongue logo. The Air unit is the largest-volume Max Air unit to date for unbelievable all-day comfort.',
  images: [
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
      alt: 'Nike Air Max 270 - Main View',
    },
    {
      id: '2',
      url: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800',
      alt: 'Nike Air Max 270 - Side View',
    },
    {
      id: '3',
      url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800',
      alt: 'Nike Air Max 270 - Top View',
    },
    {
      id: '4',
      url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800',
      alt: 'Nike Air Max 270 - Back View',
    },
  ],
  sizes: [
    { value: '38', label: '38', inStock: true },
    { value: '39', label: '39', inStock: true },
    { value: '40', label: '40', inStock: true },
    { value: '41', label: '41', inStock: false },
    { value: '42', label: '42', inStock: true },
    { value: '43', label: '43', inStock: true },
    { value: '44', label: '44', inStock: true },
    { value: '45', label: '45', inStock: false },
  ],
  rating: 4.5,
  reviewCount: 128,
  isNew: true,
  isSale: true,
  specifications: [
    { label: 'Style', value: 'AH8050-002' },
    { label: 'Color', value: 'Black/White/Anthracite' },
    { label: 'Material', value: 'Mesh upper, Rubber sole' },
    { label: 'Cushioning', value: 'Air Max 270 unit' },
    { label: 'Weight', value: '283g (size 42)' },
  ],
};

export const mockReviews: Omit<ReviewCardProps, 'onHelpful'>[] = [
  {
    id: 'review-1',
    author: {
      name: 'John Doe',
      avatar: 'https://i.pravatar.cc/100?u=john',
    },
    rating: 5,
    title: 'Best sneakers I have ever owned!',
    content:
      'These shoes are incredibly comfortable. I wear them all day at work and my feet never hurt. The Air Max cushioning is amazing. Highly recommend!',
    createdAt: '2024-01-15T10:30:00Z',
    isVerifiedPurchase: true,
    helpfulCount: 24,
  },
  {
    id: 'review-2',
    author: {
      name: 'Jane Smith',
      avatar: 'https://i.pravatar.cc/100?u=jane',
    },
    rating: 4,
    title: 'Great shoes, runs a bit small',
    content:
      'Love the design and comfort. Only issue is they run a bit small. I recommend going half a size up. Otherwise, perfect shoes for everyday wear.',
    createdAt: '2024-01-10T14:20:00Z',
    isVerifiedPurchase: true,
    helpfulCount: 12,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200'],
  },
  {
    id: 'review-3',
    author: {
      name: 'Mike Johnson',
    },
    rating: 5,
    title: 'Perfect for running and casual wear',
    content:
      'I use these for both running and casual wear. They are versatile, stylish, and super comfortable. The build quality is excellent. Worth every penny!',
    createdAt: '2024-01-05T09:15:00Z',
    isVerifiedPurchase: false,
    helpfulCount: 8,
  },
];
