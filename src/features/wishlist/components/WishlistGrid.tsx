import { WishlistItem, type WishlistItemProps } from './WishlistItem';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface WishlistGridProps {
  items: Omit<WishlistItemProps, 'onAddToCart' | 'onRemove' | 'onClick'>[];
  onAddToCart?: (productId: string) => void;
  onRemove?: (id: string) => void;
  onItemClick?: (productId: string) => void;
  onContinueShopping?: () => void;
}

export function WishlistGrid({
  items,
  onAddToCart,
  onRemove,
  onItemClick,
  onContinueShopping,
}: WishlistGridProps) {
  if (items.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-16 text-center'>
        <Heart className='mb-4 h-16 w-16 text-muted-foreground/50' />
        <h3 className='text-lg font-medium'>Your wishlist is empty</h3>
        <p className='mt-1 text-sm text-muted-foreground'>
          Save items you love by clicking the heart icon
        </p>
        {onContinueShopping && (
          <Button className='mt-4' onClick={onContinueShopping}>
            Continue Shopping
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <p className='text-sm text-muted-foreground'>
          {items.length} item{items.length !== 1 ? 's' : ''} in your wishlist
        </p>
      </div>
      <div className='grid gap-4 md:grid-cols-2'>
        {items.map((item) => (
          <WishlistItem
            key={item.id}
            {...item}
            onAddToCart={onAddToCart}
            onRemove={onRemove}
            onClick={onItemClick}
          />
        ))}
      </div>
    </div>
  );
}

export default WishlistGrid;
