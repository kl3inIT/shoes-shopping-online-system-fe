import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ProductDetail } from '@/features/products';
import {
  ReviewCard,
  ReviewForm,
  Rating,
  useShoeReviews,
  useCreateReview,
  type Review,
} from '@/features/reviews';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { mockProductDetail } from './detailData';
import { toast } from 'sonner';

export function ShoeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null
  );

  // In real app, fetch product by id
  const product = mockProductDetail;

  const { data: reviews = [], isLoading: isLoadingReviews } = useShoeReviews(
    id || ''
  );
  const createReviewMutation = useCreateReview(id || '');

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
    if (!id) return;
    if (!selectedVariantId) {
      toast.error(t('productDetail.reviews.pleaseSelectSize'));
      return;
    }

    createReviewMutation.mutate(
      {
        shoeVariantId: selectedVariantId,
        numberStars: data.rating,
        description: data.content,
        imageUrls: [], // Có thể bổ sung tính năng upload ảnh sau
      },
      {
        onSuccess: () => {
          toast.success(t('productDetail.reviews.submitSuccess'));
        },
        onError: (error: any) => {
          toast.error(t('productDetail.reviews.submitError'));
          console.error('Submit review error:', error);
        },
      }
    );
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
        onVariantChange={setSelectedVariantId}
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
              isSubmitting={createReviewMutation.isPending}
            />
          </div>

          {/* Review List */}
          <div className='space-y-4 lg:col-span-2'>
            {isLoadingReviews ? (
              <div className='flex h-40 items-center justify-center'>
                <p>{t('common.loading')}</p>
              </div>
            ) : reviews.length > 0 ? (
              reviews.map((review: Review) => (
                <ReviewCard
                  key={review.id}
                  id={review.id}
                  author={{
                    name: review.customerName,
                  }}
                  rating={review.numberStars}
                  content={review.description}
                  createdAt={review.createdAt}
                  images={review.imageUrls}
                  onHelpful={(reviewId: string) =>
                    console.log('Helpful:', reviewId)
                  }
                />
              ))
            ) : (
              <div className='flex h-40 flex-col items-center justify-center rounded-lg border border-dashed'>
                <p className='text-muted-foreground'>
                  {t('productDetail.reviews.noReviews')}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default ShoeDetailPage;
