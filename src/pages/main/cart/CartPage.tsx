import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  CartItem,
  CartSummary,
  useQueryCart,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
  mapCartItemDtoToProps,
} from '@/features/cart';
import { Button } from '@/components/ui/button';
import { ShoppingCart, ArrowLeft, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

function computeSummary(subtotal: number, itemCount: number) {
  const shipping = subtotal >= 100 ? 0 : 10;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;
  return {
    subtotal,
    shipping,
    discount: 0,
    tax,
    total,
    itemCount,
  };
}

export function CartPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  const { data, isPending, isError, error } = useQueryCart();
  const updateMutation = useUpdateCartItemMutation();
  const removeMutation = useRemoveCartItemMutation();
  const clearMutation = useClearCartMutation();

  const items = data?.items.map(mapCartItemDtoToProps) ?? [];
  const summary = data
    ? computeSummary(Number(data.totalPrice), data.totalQuantity)
    : { subtotal: 0, shipping: 0, discount: 0, tax: 0, total: 0, itemCount: 0 };

  const handleQuantityChange = (cartItemId: string, quantity: number) => {
    updateMutation.mutate({ cartItemId, body: { quantity } });
  };

  const handleRemove = (cartItemId: string) => {
    removeMutation.mutate(cartItemId);
  };

  const handleClearCart = () => {
    clearMutation.mutate(undefined, {
      onSettled: () => setClearDialogOpen(false),
    });
  };

  const handleApplyCoupon = (code: string) => {
    console.log('Apply coupon:', code);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleProductClick = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  if (isPending) {
    return (
      <div className='container mx-auto flex justify-center px-4 py-16'>
        <div className='h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent' />
      </div>
    );
  }

  if (isError) {
    return (
      <div className='container mx-auto px-4 py-16 text-center'>
        <p className='text-destructive'>
          {error instanceof Error
            ? error.message
            : t('cart.loadError', { defaultValue: 'Failed to load cart' })}
        </p>
        <Button
          className='mt-4'
          variant='outline'
          onClick={() => navigate('/products')}
        >
          {t('cart.continueShopping')}
        </Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className='container mx-auto px-4 py-16'>
        <div className='flex flex-col items-center justify-center text-center'>
          <ShoppingCart className='mb-4 h-24 w-24 text-muted-foreground/50' />
          <h1 className='text-2xl font-bold'>{t('cart.empty.title')}</h1>
          <p className='mt-2 text-muted-foreground'>
            {t('cart.empty.description')}
          </p>
          <Button className='mt-6' onClick={() => navigate('/products')}>
            {t('cart.continueShopping')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-8 flex items-center justify-between'>
        <div>
          <Button
            variant='ghost'
            className='mb-2'
            onClick={() => navigate('/products')}
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            {t('cart.continueShopping')}
          </Button>
          <h1 className='text-3xl font-bold'>{t('cart.title')}</h1>
          <p className='text-muted-foreground'>
            {t('cart.itemCount', { count: summary.itemCount })}
          </p>
        </div>
        <Button
          variant='outline'
          className='text-destructive hover:text-destructive'
          onClick={() => setClearDialogOpen(true)}
        >
          <Trash2 className='mr-2 h-4 w-4' />
          {t('cart.clearCart')}
        </Button>
      </div>

      <div className='grid gap-8 lg:grid-cols-3'>
        <div className='lg:col-span-2'>
          <div className='divide-y rounded-lg border'>
            {items.map((item) => (
              <div key={item.id} className='p-4'>
                <CartItem
                  {...item}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemove}
                  onClick={handleProductClick}
                />
              </div>
            ))}
          </div>
        </div>
        <div className='lg:col-span-1'>
          <div className='sticky top-4'>
            <CartSummary
              {...summary}
              onApplyCoupon={handleApplyCoupon}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </div>

      <Dialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('cart.clearCartConfirm.title')}</DialogTitle>
            <DialogDescription>
              {t('cart.clearCartConfirm.description')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setClearDialogOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button
              variant='destructive'
              onClick={handleClearCart}
              disabled={clearMutation.isPending}
            >
              {t('cart.clearCart')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CartPage;
