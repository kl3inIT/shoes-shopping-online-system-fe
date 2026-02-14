import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Heart, ShoppingCart, Minus, Plus, Share2 } from 'lucide-react';

export interface ProductSize {
  value: string;
  label: string;
  inStock: boolean;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
}

export interface ProductDetailProps {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  description: string;
  images: ProductImage[];
  sizes: ProductSize[];
  colors?: string[];
  rating?: number;
  reviewCount?: number;
  isNew?: boolean;
  isSale?: boolean;
  specifications?: { label: string; value: string }[];
  onAddToCart?: (id: string, size: string, quantity: number) => void;
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
  sizes,
  rating,
  reviewCount,
  isNew,
  isSale,
  specifications = [],
  onAddToCart,
  onAddToWishlist,
  onShare,
}: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (selectedSize) {
      onAddToCart?.(id, selectedSize, quantity);
    }
  };

  return (
    <div className='grid gap-8 lg:grid-cols-2'>
      {/* Images */}
      <div className='space-y-4'>
        <div className='relative aspect-square overflow-hidden rounded-lg bg-muted'>
          <img
            src={images[selectedImage]?.url}
            alt={images[selectedImage]?.alt}
            className='h-full w-full object-cover'
          />
          <div className='absolute left-4 top-4 flex flex-col gap-2'>
            {isNew && <Badge variant='default'>New</Badge>}
            {isSale && discount > 0 && (
              <Badge variant='destructive'>-{discount}%</Badge>
            )}
          </div>
        </div>
        <div className='flex gap-2 overflow-x-auto pb-2'>
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedImage(index)}
              className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border-2 transition-colors ${
                index === selectedImage
                  ? 'border-primary'
                  : 'border-transparent hover:border-muted-foreground/50'
              }`}
            >
              <img
                src={image.url}
                alt={image.alt}
                className='h-full w-full object-cover'
              />
            </button>
          ))}
        </div>
      </div>

      {/* Details */}
      <div className='space-y-6'>
        <div>
          <p className='text-sm text-muted-foreground'>{brand}</p>
          <h1 className='mt-1 text-3xl font-bold'>{name}</h1>
          {rating !== undefined && (
            <div className='mt-2 flex items-center gap-2'>
              <div className='flex items-center'>
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={
                      i < Math.round(rating) ? 'text-yellow-500' : 'text-muted'
                    }
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className='text-sm text-muted-foreground'>
                {rating.toFixed(1)} ({reviewCount} reviews)
              </span>
            </div>
          )}
        </div>

        <div className='flex items-baseline gap-3'>
          <span className='text-3xl font-bold'>${price.toFixed(2)}</span>
          {originalPrice && originalPrice > price && (
            <span className='text-xl text-muted-foreground line-through'>
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        <Separator />

        {/* Size Selection */}
        <div>
          <h3 className='mb-3 font-medium'>Select Size</h3>
          <div className='flex flex-wrap gap-2'>
            {sizes.map((size) => (
              <Button
                key={size.value}
                variant={selectedSize === size.value ? 'default' : 'outline'}
                size='sm'
                disabled={!size.inStock}
                onClick={() => setSelectedSize(size.value)}
                className='min-w-[3rem]'
              >
                {size.label}
              </Button>
            ))}
          </div>
          {!selectedSize && (
            <p className='mt-2 text-sm text-muted-foreground'>
              Please select a size
            </p>
          )}
        </div>

        {/* Quantity */}
        <div>
          <h3 className='mb-3 font-medium'>Quantity</h3>
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='icon'
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              <Minus className='h-4 w-4' />
            </Button>
            <span className='w-12 text-center font-medium'>{quantity}</span>
            <Button
              variant='outline'
              size='icon'
              onClick={() => setQuantity(quantity + 1)}
            >
              <Plus className='h-4 w-4' />
            </Button>
          </div>
        </div>

        {/* Actions */}
        <div className='flex flex-col gap-3 sm:flex-row'>
          <Button
            size='lg'
            className='flex-1'
            disabled={!selectedSize}
            onClick={handleAddToCart}
          >
            <ShoppingCart className='mr-2 h-5 w-5' />
            Add to Cart
          </Button>
          <Button
            size='lg'
            variant='outline'
            onClick={() => onAddToWishlist?.(id)}
          >
            <Heart className='mr-2 h-5 w-5' />
            Wishlist
          </Button>
          <Button size='lg' variant='ghost' onClick={() => onShare?.(id)}>
            <Share2 className='h-5 w-5' />
          </Button>
        </div>

        <Separator />

        {/* Tabs */}
        <Tabs defaultValue='description'>
          <TabsList>
            <TabsTrigger value='description'>Description</TabsTrigger>
            <TabsTrigger value='specifications'>Specifications</TabsTrigger>
          </TabsList>
          <TabsContent value='description' className='mt-4'>
            <p className='text-muted-foreground'>{description}</p>
          </TabsContent>
          <TabsContent value='specifications' className='mt-4'>
            {specifications.length > 0 ? (
              <dl className='space-y-2'>
                {specifications.map((spec) => (
                  <div key={spec.label} className='flex justify-between'>
                    <dt className='text-muted-foreground'>{spec.label}</dt>
                    <dd className='font-medium'>{spec.value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className='text-muted-foreground'>
                No specifications available.
              </p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default ProductDetail;
