import { formatCurrency } from '@/lib/utils';

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
  isSale,
  onClick,
}: ProductCardProps) {
  const hasDiscount =
    typeof originalPrice === 'number' && originalPrice > price;
  const discount = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <div className='group cursor-pointer' onClick={() => onClick?.(id)}>
      <div className='relative aspect-[4/5] overflow-hidden bg-muted'>
        <img
          src={image}
          alt={name}
          className='h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105'
        />
        {isSale && discount > 0 && (
          <span className='absolute right-3 top-3 bg-black/80 px-2 py-0.5 text-[11px] font-medium text-white'>
            -{discount}%
          </span>
        )}
      </div>

      <div className='pb-1 pt-3'>
        <h3 className='line-clamp-2 text-[13px] leading-snug text-foreground'>
          {name}
        </h3>
        <div className='mt-1 flex items-baseline gap-2'>
          <span
            className={`text-[13px] font-medium ${hasDiscount ? 'text-red-500' : 'text-foreground'}`}
          >
            {formatCurrency(price)}
          </span>
          {hasDiscount && (
            <span className='text-[12px] text-muted-foreground line-through'>
              {formatCurrency(originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
