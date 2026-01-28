export type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Review {
  id: string;
  customer: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
  };
  product: {
    id: string;
    name: string;
    imageUrl: string;
  };
  order?: {
    id: string;
    orderNumber: string;
  };
  rating: number;
  comment: string;
  status: ReviewStatus;
  createdAt: string;
  updatedAt: string;
}

export const mockReviews: Review[] = [
  {
    id: '1',
    customer: {
      id: 'c1',
      name: 'Nguyen Van A',
      email: 'nguyenvana@gmail.com',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nguyenvana',
    },
    product: {
      id: 'p1',
      name: 'Nike Air Max 270',
      imageUrl:
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    },
    order: {
      id: 'o1',
      orderNumber: 'ORD-2024-001',
    },
    rating: 5,
    comment:
      'Excellent shoes! Very comfortable and stylish. The cushioning is amazing for daily wear. Highly recommend!',
    status: 'APPROVED',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T12:00:00Z',
  },
  {
    id: '2',
    customer: {
      id: 'c2',
      name: 'Tran Thi B',
      email: 'tranthib@gmail.com',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tranthib',
    },
    product: {
      id: 'p2',
      name: 'Jordan 1 Retro High',
      imageUrl:
        'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=400',
    },
    order: {
      id: 'o2',
      orderNumber: 'ORD-2024-002',
    },
    rating: 4,
    comment:
      'Great shoes, authentic product. The only thing is they took a while to break in. But now they are super comfortable!',
    status: 'APPROVED',
    createdAt: '2024-01-21T14:00:00Z',
    updatedAt: '2024-01-21T16:00:00Z',
  },
  {
    id: '3',
    customer: {
      id: 'c3',
      name: 'Le Van C',
      email: 'levanc@gmail.com',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=levanc',
    },
    product: {
      id: 'p3',
      name: 'Adidas Ultraboost 22',
      imageUrl:
        'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400',
    },
    rating: 3,
    comment: 'Decent shoes but expected more for the price. Comfort is okay.',
    status: 'PENDING',
    createdAt: '2024-01-22T09:00:00Z',
    updatedAt: '2024-01-22T09:00:00Z',
  },
  {
    id: '4',
    customer: {
      id: 'c4',
      name: 'Pham Thi D',
      email: 'phamthid@gmail.com',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=phamthid',
    },
    product: {
      id: 'p4',
      name: 'New Balance 990v5',
      imageUrl:
        'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400',
    },
    order: {
      id: 'o4',
      orderNumber: 'ORD-2024-004',
    },
    rating: 5,
    comment:
      'Best shoes I have ever owned! Made in USA quality is evident. Worth every penny.',
    status: 'PENDING',
    createdAt: '2024-01-23T08:00:00Z',
    updatedAt: '2024-01-23T08:00:00Z',
  },
  {
    id: '5',
    customer: {
      id: 'c5',
      name: 'Hoang Van E',
      email: 'hoangvane@gmail.com',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hoangvane',
    },
    product: {
      id: 'p1',
      name: 'Nike Air Max 270',
      imageUrl:
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    },
    rating: 1,
    comment: 'Fake product! This is spam review with inappropriate content.',
    status: 'REJECTED',
    createdAt: '2024-01-19T16:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
  },
];

export const statusOptions = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
];

export const ratingOptions = [
  { value: '5', label: '5 Stars' },
  { value: '4', label: '4 Stars' },
  { value: '3', label: '3 Stars' },
  { value: '2', label: '2 Stars' },
  { value: '1', label: '1 Star' },
];
