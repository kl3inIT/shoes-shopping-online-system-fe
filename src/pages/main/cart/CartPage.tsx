import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { CartItem, CartSummary } from '@/features/cart';
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
import { mockCartItems, calculateCartSummary } from './data';

export function CartPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [items, setItems] = useState(mockCartItems);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  const summary = calculateCartSummary(items);

  const handleQuantityChange = (id: string, quantity: number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setItems([]);
    setClearDialogOpen(false);
  };

  const handleApplyCoupon = (code: string) => {
    console.log('Apply coupon:', code);
    // TODO: Implement coupon logic
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleProductClick = (productId: string) => {
    navigate(`/products/${productId}`);
  };

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
      {/* Header */}
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
        {/* Cart Items */}
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

        {/* Summary */}
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

      {/* Clear Cart Dialog */}
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
            <Button variant='destructive' onClick={handleClearCart}>
              {t('cart.clearCart')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CartPage;
