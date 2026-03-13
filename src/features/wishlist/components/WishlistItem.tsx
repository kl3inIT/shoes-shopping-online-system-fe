import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, ExternalLink } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export interface WishlistItemProps {
  id: string;
  productId: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  addedAt?: string;
  onRemove?: (id: string) => void;
  onClick?: (productId: string) => void;
}

export function WishlistItem({
  id,
  productId,
  name,
  brand,
  image,
  price,
  originalPrice,
  inStock,
  addedAt,
  onRemove,
  onClick,
}: WishlistItemProps) {
  const { t } = useTranslation();

  const addedDate =
    addedAt &&
    new Date(addedAt).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  return (
    <div className='flex flex-col gap-3 rounded-lg border bg-card p-3 sm:flex-row sm:items-start sm:gap-4 sm:p-4'>
      {/* Image */}
      <div
        className='relative h-24 w-24 shrink-0 cursor-pointer overflow-hidden rounded-md bg-muted sm:h-28 sm:w-28'
        onClick={() => onClick?.(productId)}
        role='button'
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onClick?.(productId)}
      >
        {image ? (
          <img src={image} alt={name} className='h-full w-full object-cover' />
        ) : (
          <div
            className='flex h-full w-full items-center justify-center text-muted-foreground text-xs'
            aria-hidden
          >
            No image
          </div>
        )}
      </div>

      {/* Details */}
      <div className='min-w-0 flex-1'>
        <div className='flex flex-wrap items-start gap-2'>
          <h4
            className='cursor-pointer font-semibold hover:underline'
            onClick={() => onClick?.(productId)}
          >
            {name}
          </h4>
          {!inStock && (
            <Badge variant='secondary' className='text-xs'>
              {t('productDetail.outOfStock')}
            </Badge>
          )}
        </div>
        <p className='mt-0.5 text-sm text-muted-foreground'>{brand}</p>
        <div className='mt-1 flex flex-wrap items-center gap-2'>
          <span className='font-semibold'>{formatCurrency(price)}</span>
          {originalPrice != null && originalPrice > price && (
            <span className='text-sm text-muted-foreground line-through'>
              {formatCurrency(originalPrice)}
            </span>
          )}
        </div>
        {addedDate && (
          <p className='mt-1 text-xs text-muted-foreground'>
            {t('wishlist.added', { date: addedDate })}
          </p>
        )}
      </div>

      {/* Right column: X và View Details cùng mép phải */}
      <div className='flex shrink-0 flex-col items-end justify-between self-stretch'>
        <Button
          size='icon'
          variant='ghost'
          className='h-9 w-9 text-muted-foreground hover:text-destructive'
          onClick={() => onRemove?.(id)}
          aria-label={t('wishlist.removeFromWishlist')}
        >
          <X className='h-4 w-4' />
        </Button>
        <Button
          size='sm'
          variant='outline'
          onClick={() => onClick?.(productId)}
          disabled={!inStock}
        >
          <ExternalLink className='mr-2 h-4 w-4' />
          {inStock ? t('wishlist.viewDetails') : t('wishlist.soldOut')}
        </Button>
      </div>
    </div>
  );
}

export default WishlistItem;
