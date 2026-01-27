import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart } from 'lucide-react';
import { CartItem, type CartItemProps } from './CartItem';

export interface MiniCartProps {
  isOpen: boolean;
  onClose: () => void;
  items: Omit<CartItemProps, 'onQuantityChange' | 'onRemove' | 'onClick'>[];
  subtotal: number;
  onQuantityChange?: (id: string, quantity: number) => void;
  onRemove?: (id: string) => void;
  onItemClick?: (productId: string) => void;
  onViewCart?: () => void;
  onCheckout?: () => void;
}

export function MiniCart({
  isOpen,
  onClose,
  items,
  subtotal,
  onQuantityChange,
  onRemove,
  onItemClick,
  onViewCart,
  onCheckout,
}: MiniCartProps) {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className='flex w-full flex-col sm:max-w-md'>
        <SheetHeader>
          <SheetTitle className='flex items-center gap-2'>
            <ShoppingCart className='h-5 w-5' />
            Shopping Cart ({items.length})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className='flex flex-1 flex-col items-center justify-center text-center'>
            <ShoppingCart className='mb-4 h-16 w-16 text-muted-foreground/50' />
            <p className='text-lg font-medium'>Your cart is empty</p>
            <p className='mt-1 text-sm text-muted-foreground'>
              Add some items to get started
            </p>
            <Button className='mt-4' onClick={onClose}>
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className='flex-1 -mx-6 px-6'>
              <div className='divide-y'>
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    {...item}
                    onQuantityChange={onQuantityChange}
                    onRemove={onRemove}
                    onClick={onItemClick}
                  />
                ))}
              </div>
            </ScrollArea>

            <div className='space-y-4 pt-4'>
              <Separator />
              <div className='flex justify-between font-medium'>
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <p className='text-xs text-muted-foreground'>
                Shipping and taxes calculated at checkout.
              </p>
              <SheetFooter className='flex-col gap-2 sm:flex-col'>
                <Button className='w-full' size='lg' onClick={onCheckout}>
                  Checkout
                </Button>
                <Button
                  variant='outline'
                  className='w-full'
                  onClick={onViewCart}
                >
                  View Cart
                </Button>
              </SheetFooter>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default MiniCart;
