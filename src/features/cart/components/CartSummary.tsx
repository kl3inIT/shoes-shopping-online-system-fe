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
  tax = 0,
  total,
  itemCount,
  onApplyCoupon,
  onCheckout,
  isCheckoutDisabled = false,
}: CartSummaryProps) {
  const [couponCode, setCouponCode] = useState('');

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      onApplyCoupon?.(couponCode.trim());
      setCouponCode('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex justify-between text-sm'>
          <span className='text-muted-foreground'>
            Subtotal ({itemCount} items)
          </span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        {shipping > 0 && (
          <div className='flex justify-between text-sm'>
            <span className='text-muted-foreground'>Shipping</span>
            <span>${shipping.toFixed(2)}</span>
          </div>
        )}

        {shipping === 0 && (
          <div className='flex justify-between text-sm'>
            <span className='text-muted-foreground'>Shipping</span>
            <span className='text-green-600'>Free</span>
          </div>
        )}

        {discount > 0 && (
          <div className='flex justify-between text-sm'>
            <span className='text-muted-foreground'>Discount</span>
            <span className='text-green-600'>-${discount.toFixed(2)}</span>
          </div>
        )}

        {tax > 0 && (
          <div className='flex justify-between text-sm'>
            <span className='text-muted-foreground'>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
        )}

        {/* Coupon Input */}
        {onApplyCoupon && (
          <>
            <Separator />
            <div className='flex gap-2'>
              <Input
                placeholder='Coupon code'
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className='flex-1'
              />
              <Button variant='outline' onClick={handleApplyCoupon}>
                Apply
              </Button>
            </div>
          </>
        )}

        <Separator />

        <div className='flex justify-between font-medium'>
          <span>Total</span>
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
          Proceed to Checkout
        </Button>
      </CardFooter>
    </Card>
  );
}

export default CartSummary;
