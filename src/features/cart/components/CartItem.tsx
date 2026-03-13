import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export interface CartItemProps {
  id: string;
  productId: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  size: string;
  color?: string;
  quantity: number;
  maxQuantity?: number;
  onQuantityChange?: (id: string, quantity: number) => void;
  onRemove?: (id: string) => void;
  onClick?: (productId: string) => void;
}

export function CartItem({
  id,
  productId,
  name,
  brand,
  image,
  price,
  size,
  color,
  quantity,
  maxQuantity = 10,
  onQuantityChange,
  onRemove,
  onClick,
}: CartItemProps) {
  return (
    <div className='flex gap-4 py-4'>
      <div
        className='h-24 w-24 flex-shrink-0 cursor-pointer overflow-hidden rounded-md bg-muted'
        onClick={() => onClick?.(productId)}
      >
        {image ? (
          <img src={image} alt={name} className='h-full w-full object-cover' />
        ) : (
          <div
            className='flex h-full w-full items-center justify-center text-muted-foreground'
            aria-hidden
          >
            <span className='text-xs'>No image</span>
          </div>
        )}
      </div>

      <div className='flex flex-1 flex-col justify-between'>
        <div>
          <p className='text-xs text-muted-foreground'>{brand}</p>
          <h4
            className='cursor-pointer font-medium hover:underline'
            onClick={() => onClick?.(productId)}
          >
            {name}
          </h4>
          <p className='text-sm text-muted-foreground'>
            Size: {size}
            {color ? ` · ${color}` : ''}
          </p>
        </div>

        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='icon'
              className='h-8 w-8'
              onClick={() => onQuantityChange?.(id, Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              <Minus className='h-3 w-3' />
            </Button>
            <span className='w-8 text-center text-sm'>{quantity}</span>
            <Button
              variant='outline'
              size='icon'
              className='h-8 w-8'
              onClick={() =>
                onQuantityChange?.(id, Math.min(maxQuantity, quantity + 1))
              }
              disabled={quantity >= maxQuantity}
            >
              <Plus className='h-3 w-3' />
            </Button>
          </div>

          <div className='flex items-center gap-4'>
            <span className='font-medium'>
              {formatCurrency(price * quantity)}
            </span>
            <Button
              variant='ghost'
              size='icon'
              className='h-8 w-8 text-destructive hover:text-destructive'
              onClick={() => onRemove?.(id)}
            >
              <Trash2 className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
