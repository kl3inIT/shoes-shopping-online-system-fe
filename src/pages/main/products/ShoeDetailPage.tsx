import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  ProductDetail,
  useShoeById,
  type ProductDetailProps,
} from '@/features/home/products';
import { ReviewCard, ReviewForm, Rating } from '@/features/home/reviews';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { mockReviews } from './detailData';
import { resolveImageUrl } from '@/lib/image';

export function ShoeDetailPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { data: shoe, isLoading, error } = useShoeById(id);
  const reviews = mockReviews;

  if (isLoading) {
    return (
      <div className='flex h-96 items-center justify-center'>
        <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent' />
      </div>
    );
  }

  if (error || !shoe) {
    return (
      <div className='flex h-96 flex-col items-center justify-center gap-4'>
        <p className='text-destructive'>
          {error?.message || 'Product not found'}
        </p>
        <Button onClick={() => navigate('/products')}>Back to Products</Button>
      </div>
    );
  }

  // Map backend ShoeResponse to ProductDetailProps
  const baseImages = (shoe.imageUrls?.length ? shoe.imageUrls : []).map(
    (url, index) => ({
      id: `shoe-${index}`,
      url: resolveImageUrl(url) || url,
      alt: `${shoe.name} - View ${index + 1}`,
    })
  );

  // Fallback image if backend doesn't have images
  const images =
    baseImages.length > 0
      ? baseImages
      : [
          {
            id: 'fallback',
            url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
            alt: shoe.name,
          },
        ];

  const variants = shoe.variants.map((variant) => ({
    id: variant.id,
    size: variant.size,
    color: variant.color,
    quantity: variant.quantity,
    imageUrls: (variant.imageUrls || []).map((u) => resolveImageUrl(u) ?? u),
  }));

  const productProps: ProductDetailProps = {
    id: shoe.id,
    name: shoe.name,
    brand: shoe.brandName,
    price: shoe.price,
    description: shoe.description,
    images,
    variants,
    rating: 0, // Backend doesn't provide yet
    reviewCount: 0, // Backend doesn't provide yet
    specifications: [
      { label: 'Material', value: shoe.material },
      { label: 'Gender', value: shoe.gender },
      { label: 'Status', value: shoe.status },
      { label: 'Category', value: shoe.categoryName },
    ],
  };

  const handleAddToCart = (
    productId: string,
    size: string,
    color: string,
    quantity: number
  ) => {
    console.log('Add to cart:', { productId, size, color, quantity });
    // TODO: Implement add to cart logic
  };

  const handleAddToWishlist = (productId: string) => {
    console.log('Add to wishlist:', productId);
    // TODO: Implement add to wishlist logic
  };

  const handleShare = (productId: string) => {
    console.log('Share:', productId);
    // TODO: Implement share logic
  };

  const handleSubmitReview = (data: {
    rating: number;
    title: string;
    content: string;
  }) => {
    console.log('Submit review:', data);
    // TODO: Implement submit review logic
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Back Button */}
      <Button
        variant='ghost'
        className='mb-6'
        onClick={() => navigate('/products')}
      >
        <ArrowLeft className='mr-2 h-4 w-4' />
        {t('productDetail.backToProducts')}
      </Button>

      {/* Product Detail */}
      <ProductDetail
        {...productProps}
        onAddToCart={handleAddToCart}
        onAddToWishlist={handleAddToWishlist}
        onShare={handleShare}
      />

      <Separator className='my-12' />

      {/* Reviews Section */}
      <section>
        <div className='mb-8 flex items-center justify-between'>
          <div>
            <h2 className='text-2xl font-bold'>
              {t('productDetail.reviews.title')}
            </h2>
            <div className='mt-2 flex items-center gap-2'>
              <Rating value={productProps.rating || 0} readonly />
              <span className='text-muted-foreground'>
                {t('productDetail.reviews.basedOn', { count: reviews.length })}
              </span>
            </div>
          </div>
        </div>

        <div className='grid gap-8 lg:grid-cols-3'>
          {/* Review Form */}
          <div className='lg:col-span-1'>
            <ReviewForm
              productName={productProps.name}
              onSubmit={handleSubmitReview}
            />
          </div>

          {/* Review List */}
          <div className='space-y-4 lg:col-span-2'>
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                {...review}
                onHelpful={(reviewId) => console.log('Helpful:', reviewId)}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default ShoeDetailPage;
