import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { getShoeVariants } from '../api';
import type { ShoeVariantDto } from '../types';
import { useAddToCartMutation } from '../hooks';

export interface AddToCartDialogProduct {
  id: string;
  name: string;
  image: string;
  price: number;
}

export interface AddToCartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: AddToCartDialogProduct | null;
  onAdded?: () => void;
}

function getUniqueSizes(variants: ShoeVariantDto[]) {
  const set = new Set(variants.map((v) => v.size));
  return Array.from(set).sort();
}

function getUniqueColors(variants: ShoeVariantDto[]) {
  const set = new Set(variants.map((v) => v.color));
  return Array.from(set).sort();
}

function findVariant(
  variants: ShoeVariantDto[],
  size: string,
  color: string
): ShoeVariantDto | undefined {
  return variants.find(
    (v) => v.size === size && v.color === color && v.quantity > 0
  );
}

export function AddToCartDialog({
  open,
  onOpenChange,
  product,
  onAdded,
}: AddToCartDialogProps) {
  const { t } = useTranslation();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const { data: variants = [], isPending: variantsLoading } = useQuery({
    queryKey: ['shoe-variants', product?.id],
    queryFn: () => getShoeVariants(product!.id),
    enabled: open && !!product?.id,
  });

  const addMutation = useAddToCartMutation();

  const sizes = useMemo(() => getUniqueSizes(variants), [variants]);
  const colors = useMemo(() => getUniqueColors(variants), [variants]);
  const selectedVariant = useMemo(
    () =>
      selectedSize && selectedColor
        ? findVariant(variants, selectedSize, selectedColor)
        : undefined,
    [variants, selectedSize, selectedColor]
  );
  const maxQty = selectedVariant ? Math.min(selectedVariant.quantity, 99) : 1;

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setSelectedSize(null);
      setSelectedColor(null);
      setQuantity(1);
    }
    onOpenChange(next);
  };

  const handleAddToCart = () => {
    if (!product || !selectedSize || !selectedColor) return;
    addMutation.mutate(
      {
        shoeId: product.id,
        size: selectedSize,
        color: selectedColor,
        quantity,
      },
      {
        onSuccess: () => {
          onAdded?.();
          handleOpenChange(false);
        },
      }
    );
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>
            {t('products.addToCart', { defaultValue: 'Add to Cart' })}
          </DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <div className='flex gap-4'>
            <div className='h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-muted'>
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className='h-full w-full object-cover'
                />
              ) : (
                <div className='flex h-full w-full items-center justify-center text-muted-foreground text-xs'>
                  No image
                </div>
              )}
            </div>
            <div className='min-w-0 flex-1'>
              <h4 className='font-medium'>{product.name}</h4>
              <p className='text-lg font-semibold'>
                ${product.price.toFixed(2)}
              </p>
            </div>
          </div>

          {variantsLoading ? (
            <p className='text-sm text-muted-foreground'>
              {t('common.loading', { defaultValue: 'Loading...' })}
            </p>
          ) : variants.length === 0 ? (
            <p className='text-sm text-muted-foreground'>
              {t('productDetail.outOfStock', { defaultValue: 'Out of stock' })}
            </p>
          ) : (
            <>
              {sizes.length > 0 && (
                <div>
                  <p className='mb-2 text-sm font-medium'>
                    {t('productDetail.selectSize', {
                      defaultValue: 'Select Size',
                    })}
                  </p>
                  <div className='flex flex-wrap gap-2'>
                    {sizes.map((size) => (
                      <Button
                        key={size}
                        variant={selectedSize === size ? 'default' : 'outline'}
                        size='sm'
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              {colors.length > 0 && (
                <div>
                  <p className='mb-2 text-sm font-medium'>
                    {t('productDetail.selectColor', { defaultValue: 'Color' })}
                  </p>
                  <div className='flex flex-wrap gap-2'>
                    {colors.map((color) => (
                      <Button
                        key={color}
                        variant={
                          selectedColor === color ? 'default' : 'outline'
                        }
                        size='sm'
                        onClick={() => setSelectedColor(color)}
                      >
                        {color}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <p className='mb-2 text-sm font-medium'>
                  {t('productDetail.quantity', { defaultValue: 'Quantity' })}
                </p>
                <div className='flex items-center gap-2'>
                  <Button
                    variant='outline'
                    size='icon'
                    className='h-9 w-9'
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className='h-4 w-4' />
                  </Button>
                  <span className='w-10 text-center font-medium'>
                    {quantity}
                  </span>
                  <Button
                    variant='outline'
                    size='icon'
                    className='h-9 w-9'
                    onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                    disabled={quantity >= maxQty}
                  >
                    <Plus className='h-4 w-4' />
                  </Button>
                </div>
              </div>

              <Button
                className='w-full'
                disabled={
                  !selectedVariant || quantity < 1 || addMutation.isPending
                }
                onClick={handleAddToCart}
              >
                <ShoppingCart className='mr-2 h-4 w-4' />
                {addMutation.isPending
                  ? t('common.loading', { defaultValue: 'Adding...' })
                  : t('products.addToCart', { defaultValue: 'Add to Cart' })}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AddToCartDialog;
