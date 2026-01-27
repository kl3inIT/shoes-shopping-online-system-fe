import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Heart, ShoppingCart } from 'lucide-react';

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
  isNew,
  isSale,
  rating,
  onAddToCart,
  onAddToWishlist,
  onClick,
}: ProductCardProps) {
  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <Card
      className='group cursor-pointer overflow-hidden transition-all hover:shadow-lg'
      onClick={() => onClick?.(id)}
    >
      <div className='relative aspect-square overflow-hidden bg-muted'>
        <img
          src={image}
          alt={name}
          className='h-full w-full object-cover transition-transform group-hover:scale-105'
        />
        <div className='absolute left-2 top-2 flex flex-col gap-1'>
          {isNew && <Badge variant='default'>New</Badge>}
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
                  e.stopPropagation();
                  onAddToWishlist?.(id);
                }}
              >
                <Heart className='h-4 w-4' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add to Wishlist</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size='icon'
                variant='secondary'
                className='h-8 w-8'
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart?.(id);
                }}
              >
                <ShoppingCart className='h-4 w-4' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add to Cart</TooltipContent>
          </Tooltip>
        </div>
      </div>
      <CardContent className='p-4'>
        <p className='text-xs text-muted-foreground'>{brand}</p>
        <h3 className='mt-1 line-clamp-2 font-medium'>{name}</h3>
        {rating !== undefined && (
          <div className='mt-1 flex items-center gap-1'>
            <span className='text-yellow-500'>★</span>
            <span className='text-sm text-muted-foreground'>
              {rating.toFixed(1)}
            </span>
          </div>
        )}
      </CardContent>
      <CardFooter className='p-4 pt-0'>
        <div className='flex items-center gap-2'>
          <span className='text-lg font-bold'>${price.toFixed(2)}</span>
          {originalPrice && originalPrice > price && (
            <span className='text-sm text-muted-foreground line-through'>
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

export default ProductCard;
