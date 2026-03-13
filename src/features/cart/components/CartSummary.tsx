import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface CartSummaryProps {
  subtotal: number;
  shipping?: number;
  discount?: number;
  tax?: number;
  total: number;
  itemCount: number;
  onApplyCoupon?: (code: string) => void;
  onCheckout?: () => void;
  isCheckoutDisabled?: boolean;
}

export function CartSummary({
  subtotal,
  shipping = 0,
  discount = 0,
  total,
  itemCount,
  onApplyCoupon,
  onCheckout,
  isCheckoutDisabled = false,
}: CartSummaryProps) {
  const [couponCode, setCouponCode] = useState('');
  const { t } = useTranslation();

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      onApplyCoupon?.(couponCode.trim());
      setCouponCode('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t('cart.summary.title', { defaultValue: 'Order Summary' })}
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex justify-between text-sm'>
          <span className='text-muted-foreground'>
            {t('cart.summary.subtotal', { defaultValue: 'Subtotal' })} (
            {itemCount}{' '}
            {t('cart.summary.items', {
              defaultValue: 'items',
              count: itemCount,
            })}
            )
          </span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        {shipping > 0 && (
          <div className='flex justify-between text-sm'>
            <span className='text-muted-foreground'>
              {t('cart.summary.shipping', { defaultValue: 'Shipping' })}
            </span>
            <span>${shipping.toFixed(2)}</span>
          </div>
        )}

        {shipping === 0 && (
          <div className='flex justify-between text-sm'>
            <span className='text-muted-foreground'>
              {t('cart.summary.shipping', { defaultValue: 'Shipping' })}
            </span>
            <span className='text-green-600'>
              {t('cart.summary.freeShipping', { defaultValue: 'Free' })}
            </span>
          </div>
        )}

        {discount > 0 && (
          <div className='flex justify-between text-sm'>
            <span className='text-muted-foreground'>
              {t('cart.summary.discount', { defaultValue: 'Discount' })}
            </span>
            <span className='text-green-600'>-${discount.toFixed(2)}</span>
          </div>
        )}

        {/* {tax > 0 && (
          <div className='flex justify-between text-sm'>
            <span className='text-muted-foreground'>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
        )} */}

        {/* Coupon Input */}
        {onApplyCoupon && (
          <>
            <Separator />
            <div className='flex gap-2'>
              <Input
                placeholder={t('cart.summary.couponPlaceholder', {
                  defaultValue: 'Coupon code',
                })}
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className='flex-1'
              />
              <Button variant='outline' onClick={handleApplyCoupon}>
                {t('cart.summary.applyCoupon', { defaultValue: 'Apply' })}
              </Button>
            </div>
          </>
        )}

        <Separator />

        <div className='flex justify-between font-medium'>
          <span>{t('cart.summary.total', { defaultValue: 'Total' })}</span>
          <span className='text-lg'>${total.toFixed(2)}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className='w-full'
          size='lg'
          onClick={onCheckout}
          disabled={isCheckoutDisabled || itemCount === 0}
        >
          {t('cart.summary.proceedToCheckout', {
            defaultValue: 'Proceed to Checkout',
          })}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default CartSummary;
