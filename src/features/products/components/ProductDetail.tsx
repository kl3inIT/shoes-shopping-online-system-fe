import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Heart, ShoppingCart, Minus, Plus, Share2 } from 'lucide-react';

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
}

export interface ProductSize {
  value: string;
  label: string;
  inStock?: boolean;
}

export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  quantity: number;
  imageUrls: string[];
}

export interface ProductDetailProps {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  description: string;
  images: ProductImage[]; // Base images from shoe
  variants: ProductVariant[];
  sizes?: ProductSize[];
  rating?: number;
  reviewCount?: number;
  isSale?: boolean;
  isNew?: boolean;
  isInWishlist?: boolean;
  specifications?: { label: string; value: string }[];
  onAddToCart?: (
    id: string,
    size: string,
    color: string,
    quantity: number
  ) => void;
  onAddToWishlist?: (id: string) => void;
  onShare?: (id: string) => void;
}

export function ProductDetail({
  id,
  name,
  brand,
  price,
  originalPrice,
  description,
  images,
  variants,
  rating,
  reviewCount,
  isSale,
  specifications = [],
  onAddToCart,
  onAddToWishlist,
  onShare,
  isInWishlist,
}: ProductDetailProps) {
  const { t } = useTranslation();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Derive unique sizes
  const uniqueSizes = Array.from(new Set(variants.map((v) => v.size))).sort();

  // Derive colors available for the selected size
  const availableColors = selectedSize
    ? variants.filter((v) => v.size === selectedSize).map((v) => v.color)
    : [];

  // Find the selected variant
  const selectedVariant = variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  );

  // Combine shoe images and all variant images for a single horizontal gallery
  // Each image will have a unique stable ID to avoid re-renders
  const allImages = [
    ...images.map((img) => ({ ...img, type: 'shoe' as const })),
    ...variants.flatMap((v) =>
      v.imageUrls.map((url, i) => ({
        id: `variant-${v.id}-${i}`,
        url,
        alt: `${name} ${v.color}`,
        type: 'variant' as const,
        variantId: v.id,
      }))
    ),
  ];

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    setSelectedColor(null);
    setQuantity(1);
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setQuantity(1);

    // When color is selected, find the first image of this variant and scroll to it
    const variant = variants.find(
      (v) => v.size === selectedSize && v.color === color
    );
    if (variant && variant.imageUrls.length > 0) {
      const firstImageIndex = allImages.findIndex(
        (img) =>
          img.type === 'variant' &&
          'variantId' in img &&
          img.variantId === variant.id
      );
      if (firstImageIndex !== -1) {
        setActiveImageIndex(firstImageIndex);
      }
    }
  };

  const handleAddToCart = () => {
    if (selectedSize && selectedColor && selectedVariant) {
      // Pass selected variant id as first argument so backend can resolve exact variant
      onAddToCart?.(selectedVariant.id, selectedSize, selectedColor, quantity);
    }
  };

  const maxQuantity = selectedVariant?.quantity || 0;

  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <div className='grid gap-8 lg:grid-cols-2'>
      {/* Images Gallery */}
      <div className='space-y-4'>
        <div className='relative aspect-square overflow-hidden rounded-lg bg-muted'>
          <a
            href={`/products/${id}`}
            onClick={(event) => event.preventDefault()}
            className='block h-full w-full'
          >
            <img
              src={allImages[activeImageIndex]?.url}
              alt={allImages[activeImageIndex]?.alt}
              draggable={false}
              className='h-full w-full object-contain'
            />
          </a>
          <div className='absolute left-4 top-4 flex flex-col gap-2'>
            {isSale && discount > 0 && (
              <Badge variant='destructive'>-{discount}%</Badge>
            )}
          </div>
        </div>
        <div className='flex gap-2 overflow-x-auto pb-2'>
          {allImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setActiveImageIndex(index)}
              className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border-2 transition-colors ${
                index === activeImageIndex
                  ? 'border-primary'
                  : 'border-transparent hover:border-muted-foreground/50'
              }`}
            >
              <a
                href={`/products/${id}`}
                onClick={(event) => event.preventDefault()}
                className='block h-full w-full'
              >
                <img
                  src={image.url}
                  alt={image.alt}
                  draggable={false}
                  className='h-full w-full object-contain'
                />
              </a>
            </button>
          ))}
        </div>
      </div>

      {/* Product Details */}
      <div className='space-y-6'>
        <div>
          <p className='text-sm text-muted-foreground'>{brand}</p>
          <h1 className='mt-1 text-3xl font-bold'>{name}</h1>
          {rating !== undefined && (
            <div className='mt-2 flex items-center gap-2'>
              <div className='flex items-center'>
                {Array.from({ length: 5 }, (_, starIndex) => starIndex + 1).map(
                  (starValue) => (
                    <span
                      key={starValue}
                      className={
                        starValue <= Math.round(rating)
                          ? 'text-yellow-500'
                          : 'text-muted'
                      }
                    >
                      ★
                    </span>
                  )
                )}
              </div>
              <span className='text-sm text-muted-foreground'>
                {rating.toFixed(1)} (
                {t('reviews.count', {
                  count: reviewCount ?? 0,
                  defaultValue:
                    '{{count}} ' + (reviewCount === 1 ? 'review' : 'reviews'),
                })}
                )
              </span>
            </div>
          )}
        </div>

        <div className='flex items-baseline gap-3'>
          <span className='text-3xl font-bold'>
            {t('products.price', {
              defaultValue: new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
              }).format(price),
            })}
          </span>
          {originalPrice && originalPrice > price && (
            <span className='text-xl text-muted-foreground line-through'>
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
              }).format(originalPrice)}
            </span>
          )}
        </div>

        <Separator />

        {/* Color (optional) */}
        {availableColors.length > 0 && !selectedSize && (
          <div>
            <h3 className='mb-3 font-medium'>
              {t('productDetail.selectColor')}
            </h3>
            <div className='flex flex-wrap gap-2'>
              {availableColors.map((color) => (
                <Button
                  key={color}
                  variant={selectedColor === color ? 'default' : 'outline'}
                  size='sm'
                  onClick={() => handleColorSelect(color)}
                >
                  {color}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Size Selection */}
        <div className='space-y-3'>
          <h3 className='font-medium'>{t('productDetail.selectSize')}</h3>
          <div className='flex flex-wrap gap-2'>
            {uniqueSizes.map((size) => {
              const hasStockForSize = variants
                .filter((v) => v.size === size)
                .some((v) => v.quantity > 0);
              return (
                <Button
                  key={size}
                  variant={selectedSize === size ? 'default' : 'outline'}
                  size='sm'
                  disabled={!hasStockForSize}
                  onClick={() => handleSizeSelect(size)}
                  className='min-w-[3rem]'
                >
                  {size}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Color Selection */}
        {selectedSize && (
          <div className='space-y-3 animate-in fade-in slide-in-from-top-1'>
            <h3 className='font-medium'>{t('productDetail.selectColor')}</h3>
            <div className='flex flex-wrap gap-2'>
              {availableColors.map((color) => {
                const variant = variants.find(
                  (v) => v.size === selectedSize && v.color === color
                );
                const isOutOfStock = (variant?.quantity || 0) <= 0;
                return (
                  <Button
                    key={color}
                    variant={selectedColor === color ? 'default' : 'outline'}
                    size='sm'
                    disabled={isOutOfStock}
                    onClick={() => handleColorSelect(color)}
                  >
                    {color}
                    {isOutOfStock && ' (Hết hàng)'}
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        {/* Stock Status & Quantity */}
        <div className='space-y-3'>
          <div className='flex items-center justify-between'>
            <h3 className='font-medium'>{t('productDetail.quantity')}</h3>
            {selectedVariant && (
              <span className='text-sm text-muted-foreground'>
                {t('productDetail.inStockCount', {
                  count: selectedVariant.quantity,
                })}
              </span>
            )}
          </div>
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='icon'
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1 || !selectedVariant}
            >
              <Minus className='h-4 w-4' />
            </Button>
            <span className='w-12 text-center font-medium'>{quantity}</span>
            <Button
              variant='outline'
              size='icon'
              onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
              disabled={quantity >= maxQuantity || !selectedVariant}
            >
              <Plus className='h-4 w-4' />
            </Button>
          </div>
        </div>

        {/* Actions */}
        <div className='flex flex-col gap-3 sm:flex-row pt-2'>
          <Button
            size='lg'
            className='flex-1'
            disabled={!selectedVariant || maxQuantity <= 0}
            onClick={handleAddToCart}
          >
            <ShoppingCart className='mr-2 h-5 w-5' />
            {t('productDetail.addToCart')}
          </Button>
          <Button
            size='lg'
            variant='outline'
            onClick={() => onAddToWishlist?.(id)}
          >
            <Heart
              className={`mr-2 h-5 w-5 ${
                isInWishlist ? 'fill-red-500 text-red-500' : ''
              }`}
            />
            {isInWishlist
              ? t('productDetail.addedToWishlist', {
                  defaultValue: 'Added to wishlist',
                })
              : t('productDetail.wishlist')}
          </Button>
          <Button size='lg' variant='ghost' onClick={() => onShare?.(id)}>
            <Share2 className='h-5 w-5' />
          </Button>
        </div>

        <Separator />

        {/* Tabs */}
        <Tabs defaultValue='description'>
          <TabsList className='w-full justify-start'>
            <TabsTrigger value='description'>
              {t('productDetail.description')}
            </TabsTrigger>
            <TabsTrigger value='specifications'>
              {t('productDetail.specifications')}
            </TabsTrigger>
          </TabsList>
          <TabsContent value='description' className='mt-4'>
            <p className='text-muted-foreground leading-relaxed'>
              {description}
            </p>
          </TabsContent>
          <TabsContent value='specifications' className='mt-4'>
            {specifications.length > 0 ? (
              <dl className='grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2'>
                {specifications.map((spec) => (
                  <div key={spec.label} className='border-b pb-2 sm:border-0'>
                    <dt className='text-sm text-muted-foreground'>
                      {spec.label}
                    </dt>
                    <dd className='font-medium'>{spec.value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className='text-muted-foreground'>
                {t('productDetail.noSpecifications')}
              </p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default ProductDetail;
