import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import {
  ProductDetail,
  useShoeById,
  type ProductDetailProps,
} from '@/features/products';
import {
  ReviewCard,
  ReviewForm,
  Rating,
  usePublicReviewsByShoeId,
  useReviewEligibilityByShoeId,
  useCreateReviewMutation,
  useMarkReviewHelpfulMutation,
} from '@/features/reviews';
import { Separator } from '@/components/ui/separator';
import { useAddToCartMutation } from '@/features/cart';
import { useAddToWishlistMutation } from '@/features/wishlist';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { resolveImageUrl } from '@/lib/image';
import { toast } from 'sonner';

export function ShoeDetailPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const auth = useAuth();
  const { id } = useParams<{ id: string }>();

  const { data: shoe, isLoading, error } = useShoeById(id);
  const { data: reviewsData } = usePublicReviewsByShoeId(id);
  const { data: eligibility } = useReviewEligibilityByShoeId(
    id,
    auth.isAuthenticated
  );
  const createReviewMutation = useCreateReviewMutation(id);
  const markHelpfulMutation = useMarkReviewHelpfulMutation(id);
  const addToCartMutation = useAddToCartMutation();
  const addToWishlistMutation = useAddToWishlistMutation();
  const reviews =
    reviewsData?.items?.map((r) => ({
      id: r.id,
      author: {
        name: r.authorName,
        avatar: resolveImageUrl(r.authorAvatarUrl ?? undefined),
      },
      rating: r.numberStars,
      content: r.description,
      createdAt: r.createdAt,
      images: (r.imageUrls ?? [])
        .map((u) => resolveImageUrl(u) ?? u)
        .filter(Boolean),
      isVerifiedPurchase: true,
      helpfulCount: r.helpfulCount ?? 0,
      initialHelpful: r.currentUserVoted ?? false,
    })) ?? [];

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
    rating: reviewsData?.avgRating ?? 0,
    reviewCount: reviewsData?.reviewCount ?? 0,
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
    addToCartMutation.mutate({
      shoeId: productId,
      size,
      color,
      quantity,
    });
  };

  const handleAddToWishlist = (productId: string) => {
    addToWishlistMutation.mutate(productId);
  };

  const handleShare = (productId: string) => {
    console.log('Share:', productId);
    // TODO: Implement share logic
  };

  const handleSubmitReview = (data: {
    rating: number;
    title: string;
    content: string;
    images: File[];
  }) => {
    if (
      !eligibility?.eligible ||
      !eligibility.orderDetailId ||
      !eligibility.shoeVariantId
    ) {
      return;
    }
    const description = data.title?.trim()
      ? `${data.title.trim()}\n\n${data.content}`
      : data.content;

    createReviewMutation.mutate({
      orderDetailId: eligibility.orderDetailId,
      shoeVariantId: eligibility.shoeVariantId,
      numberStars: data.rating,
      description,
      images: data.images,
    });
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
          {auth.isAuthenticated && eligibility?.eligible ? (
            <div className='lg:col-span-1'>
              <ReviewForm
                productName={productProps.name}
                onSubmit={handleSubmitReview}
                isSubmitting={createReviewMutation.isPending}
              />
            </div>
          ) : null}

          {/* Review List */}
          <div className='space-y-4 lg:col-span-2'>
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                {...review}
                onHelpful={(reviewId) => markHelpfulMutation.mutate(reviewId)}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default ShoeDetailPage;
