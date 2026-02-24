import { useTranslation } from 'react-i18next';
import { WishlistItem, type WishlistItemProps } from './WishlistItem';
import { Heart, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface WishlistGridProps {
  items: Omit<WishlistItemProps, 'onRemove' | 'onClick'>[];
  onRemove?: (id: string) => void;
  onItemClick?: (productId: string) => void;
  onContinueShopping?: () => void;
  sortByDateAsc?: boolean;
  onToggleSort?: () => void;
}

export function WishlistGrid({
  items,
  onRemove,
  onItemClick,
  onContinueShopping,
  sortByDateAsc = true,
  onToggleSort,
}: WishlistGridProps) {
  const { t } = useTranslation();

  if (items.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-16 text-center'>
        <Heart className='mb-4 h-16 w-16 text-muted-foreground/50' />
        <h3 className='text-lg font-medium'>{t('wishlist.empty.title')}</h3>
        <p className='mt-1 text-sm text-muted-foreground'>
          {t('wishlist.empty.description')}
        </p>
        {onContinueShopping && (
          <Button className='mt-4' onClick={onContinueShopping}>
            {t('wishlist.continueShopping')}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header: Saved Items + count | Date Added sort */}
      <div className='flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>
            {t('wishlist.savedItems')}
          </h1>
          <p className='mt-1 text-sm text-muted-foreground'>
            {t('wishlist.itemCount', { count: items.length })}
          </p>
        </div>
        <div className='flex flex-wrap gap-2'>
          {onToggleSort && (
            <Button variant='outline' size='sm' onClick={onToggleSort}>
              <ArrowUpDown className='mr-2 h-4 w-4' />
              {sortByDateAsc
                ? t('wishlist.dateAddedNewest')
                : t('wishlist.dateAddedOldest')}
            </Button>
          )}
        </div>
      </div>

      {/* Vertical list of items */}
      <div className='space-y-3'>
        {items.map((item) => (
          <WishlistItem
            key={item.id}
            {...item}
            onRemove={onRemove}
            onClick={onItemClick}
          />
        ))}
      </div>
    </div>
  );
}

export default WishlistGrid;
