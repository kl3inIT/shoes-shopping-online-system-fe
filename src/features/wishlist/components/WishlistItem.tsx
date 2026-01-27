import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Trash2, ExternalLink } from 'lucide-react';

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
  onAddToCart?: (productId: string) => void;
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
  onAddToCart,
  onRemove,
  onClick,
}: WishlistItemProps) {
  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <Card className='overflow-hidden'>
      <div className='flex flex-col sm:flex-row'>
        <div
          className='relative aspect-square w-full cursor-pointer overflow-hidden bg-muted sm:w-40'
          onClick={() => onClick?.(productId)}
        >
          <img src={image} alt={name} className='h-full w-full object-cover' />
          {discount > 0 && (
            <Badge variant='destructive' className='absolute left-2 top-2'>
              -{discount}%
            </Badge>
          )}
        </div>

        <CardContent className='flex flex-1 flex-col justify-between p-4'>
          <div>
            <p className='text-xs text-muted-foreground'>{brand}</p>
            <h4
              className='cursor-pointer font-medium hover:underline'
              onClick={() => onClick?.(productId)}
            >
              {name}
            </h4>
            <div className='mt-2 flex items-center gap-2'>
              <span className='font-bold'>${price.toFixed(2)}</span>
              {originalPrice && originalPrice > price && (
                <span className='text-sm text-muted-foreground line-through'>
                  ${originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <div className='mt-2'>
              {inStock ? (
                <Badge variant='outline' className='text-green-600'>
                  In Stock
                </Badge>
              ) : (
                <Badge variant='outline' className='text-red-600'>
                  Out of Stock
                </Badge>
              )}
            </div>
            {addedAt && (
              <p className='mt-2 text-xs text-muted-foreground'>
                Added on {new Date(addedAt).toLocaleDateString()}
              </p>
            )}
          </div>

          <div className='mt-4 flex flex-wrap gap-2'>
            <Button
              size='sm'
              disabled={!inStock}
              onClick={() => onAddToCart?.(productId)}
            >
              <ShoppingCart className='mr-2 h-4 w-4' />
              Add to Cart
            </Button>
            <Button
              size='sm'
              variant='outline'
              onClick={() => onClick?.(productId)}
            >
              <ExternalLink className='mr-2 h-4 w-4' />
              View Details
            </Button>
            <Button
              size='sm'
              variant='ghost'
              className='text-destructive hover:text-destructive'
              onClick={() => onRemove?.(id)}
            >
              <Trash2 className='h-4 w-4' />
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

export default WishlistItem;
