import { useMutation, useQuery } from '@tanstack/react-query';
import { type Review, type CreateReviewRequest } from '../types';

export const reviewKeys = {
  all: ['reviews'] as const,
  byShoe: (shoeId: string) => [...reviewKeys.all, 'shoe', shoeId] as const,
};

// Mock dữ liệu review cố định (không gọi API)
export const mockShoeReviews: Review[] = [
  {
    id: 'rev-1',
    customerId: 'c1',
    customerName: 'Nguyễn Văn A',
    shoeVariantId: 'variant-1',
    shoeName: 'Nike Air Max 270',
    variantInfo: '42 - Black',
    numberStars: 5,
    description: 'Giày rất đẹp và êm, giao hàng nhanh. Rất hài lòng!',
    status: 'APPROVED',
    imageUrls: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    ],
    createdAt: new Date('2024-02-20').toISOString(),
    updatedAt: new Date('2024-02-20').toISOString(),
  },
  {
    id: 'rev-2',
    customerId: 'c2',
    customerName: 'Trần Thị B',
    shoeVariantId: 'variant-2',
    shoeName: 'Adidas Ultraboost',
    variantInfo: '38 - White',
    numberStars: 4,
    description: 'Giày đi thoải mái, nhưng hộp hơi móp một chút.',
    status: 'APPROVED',
    imageUrls: [],
    createdAt: new Date('2024-02-21').toISOString(),
    updatedAt: new Date('2024-02-21').toISOString(),
  },
  {
    id: 'rev-3',
    customerId: 'c3',
    customerName: 'Lê Văn C',
    shoeVariantId: 'variant-3',
    shoeName: 'Jordan 1 Retro High',
    variantInfo: '43 - Chicago',
    numberStars: 5,
    description: 'Hàng chuẩn, phối màu đẹp tuyệt vời. Sẽ ủng hộ shop tiếp.',
    status: 'PENDING',
    imageUrls: [],
    createdAt: new Date('2024-02-22').toISOString(),
    updatedAt: new Date('2024-02-22').toISOString(),
  },
  {
    id: 'rev-4',
    customerId: 'c4',
    customerName: 'Phạm Minh D',
    shoeVariantId: 'variant-4',
    shoeName: 'Converse Chuck Taylor',
    variantInfo: '40 - Black/White',
    numberStars: 3,
    description: 'Đế hơi cứng so với mong đợi, nhưng kiểu dáng thì vẫn ổn.',
    status: 'REJECTED',
    imageUrls: [],
    createdAt: new Date('2024-02-23').toISOString(),
    updatedAt: new Date('2024-02-23').toISOString(),
  },
];

// Hooks cho khách hàng – trả về dữ liệu mock
export const useShoeReviews = (shoeId: string) => {
  return useQuery({
    queryKey: reviewKeys.byShoe(shoeId),
    queryFn: async () => {
      // Trả về mock data, bạn có thể filter theo shoeId nếu cần,
      // nhưng ở đây trả về toàn bộ để demo mock data ban đầu
      return mockShoeReviews.filter((r) => r.status === 'APPROVED');
    },
    enabled: !!shoeId,
  });
};

// Mutation tạo review chỉ giả lập, không gọi backend
export const useCreateReview = (_shoeId: string) => {
  return useMutation({
    mutationFn: async (_data: CreateReviewRequest) => {
      // Trả về một review giả lập, FE chỉ cần để hiện toast thành công
      return mockShoeReviews[0];
    },
  });
};
