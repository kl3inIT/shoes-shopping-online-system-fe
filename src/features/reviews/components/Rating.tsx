import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface RatingProps {
  value?: number;
  max?: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

export function Rating({
  value = 0,
  max = 5,
  onChange,
  readonly = false,
  size = 'md',
  showValue = false,
}: RatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const displayValue = hoverValue !== null ? hoverValue : value;

  return (
    <div className='flex items-center gap-1'>
      <div className='flex'>
        {Array.from({ length: max }).map((_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= displayValue;
          const isHalf = !isFilled && starValue - 0.5 <= displayValue;

          return (
            <button
              key={index}
              type='button'
              disabled={readonly}
              onClick={() => !readonly && onChange?.(starValue)}
              onMouseEnter={() => !readonly && setHoverValue(starValue)}
              onMouseLeave={() => !readonly && setHoverValue(null)}
              className={cn(
                'relative transition-colors',
                readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
              )}
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  'transition-colors',
                  isFilled
                    ? 'fill-yellow-400 text-yellow-400'
                    : isHalf
                      ? 'fill-yellow-400/50 text-yellow-400'
                      : 'fill-muted text-muted-foreground/30'
                )}
              />
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className='ml-1 text-sm text-muted-foreground'>
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
}

export default Rating;
