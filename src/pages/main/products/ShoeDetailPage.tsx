import { useParams, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ProductDetail } from '@/features/products';
import { ReviewCard, ReviewForm, Rating } from '@/features/reviews';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { mockProductDetail, mockReviews } from './detailData';

export function ShoeDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // In real app, fetch product by id
  const product = mockProductDetail;
  const reviews = mockReviews;

  const handleAddToCart = (
    productId: string,
    size: string,
    quantity: number
  ) => {
    console.log('Add to cart:', { productId, size, quantity });
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
        {...product}
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
              <Rating value={product.rating || 0} readonly />
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
              productName={product.name}
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
