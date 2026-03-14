import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { formatCurrency } from '@/lib/utils';
import { Heart, ShoppingCart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  brand: string;
  isNew?: boolean;
  isSale?: boolean;
  rating?: number;
  reviewCount?: number;
  isInWishlist?: boolean;
  onAddToCart?: (id: string) => void;
  onAddToWishlist?: (id: string) => void;
  onClick?: (id: string) => void;
}

export function ProductCard({
  id,
  name,
  price,
  originalPrice,
  image,
  brand,
  isSale,
  rating,
  reviewCount,
  isInWishlist,
  onAddToCart,
  onAddToWishlist,
  onClick,
}: ProductCardProps) {
  const { t } = useTranslation();
  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const detailHref = `/products/${id}`;

  return (
    <Card
      className='group flex h-full cursor-pointer flex-col overflow-hidden transition-all hover:shadow-lg'
      onClick={() => onClick?.(id)}
    >
      <a
        href={detailHref}
        className='relative aspect-square overflow-hidden bg-muted'
        onClick={(event) => {
          event.preventDefault();
          onClick?.(id);
        }}
      >
        {image ? (
          <img
            src={image}
            alt={name}
            draggable={false}
            className='h-full w-full object-cover transition-transform group-hover:scale-105'
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className='flex h-full w-full items-center justify-center text-sm text-muted-foreground'>
            Chưa có ảnh
          </div>
        )}
        <div className='absolute left-2 top-2 flex flex-col gap-1'>
          {isSale && discount > 0 && (
            <Badge variant='destructive'>-{discount}%</Badge>
          )}
        </div>
        <div className='absolute right-2 top-2 flex flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100'>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size='icon'
                variant='secondary'
                className='h-8 w-8'
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onAddToWishlist?.(id);
                }}
              >
                <Heart
                  className={`h-4 w-4 ${
                    isInWishlist ? 'fill-red-500 text-red-500' : ''
                  }`}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isInWishlist
                ? t('wishlist.removeFromWishlist')
                : t('products.addToWishlist')}
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size='icon'
                variant='secondary'
                className='h-8 w-8'
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onAddToCart?.(id);
                }}
              >
                <ShoppingCart className='h-4 w-4' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t('products.addToCart')}</TooltipContent>
          </Tooltip>
        </div>
      </a>
      <CardContent className='flex flex-1 flex-col gap-1.5 p-4'>
        <p className='text-xs font-medium text-muted-foreground'>{brand}</p>
        <h3 className='line-clamp-2 text-sm font-semibold leading-snug'>
          {name}
        </h3>
        {rating !== undefined && (
          <div className='flex items-center gap-1 text-xs'>
            <span className='text-yellow-500'>★</span>
            <span className='text-muted-foreground'>
              {rating.toFixed(1)}
              {typeof reviewCount === 'number' &&
                ` (${t('reviews.count', {
                  count: reviewCount,
                  defaultValue: `${reviewCount} reviews`,
                })})`}
            </span>
          </div>
        )}
      </CardContent>
      <CardFooter className='mt-auto p-4 pt-0'>
        <div className='flex items-center gap-2'>
          <span className='text-lg font-bold'>{formatCurrency(price)}</span>
          {originalPrice && originalPrice > price && (
            <span className='text-sm text-muted-foreground line-through'>
              {formatCurrency(originalPrice)}
            </span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

export default ProductCard;
