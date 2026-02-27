import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface CheckoutItem {
  id: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  size: string;
  quantity: number;
}

export interface CheckoutOrderSummaryProps {
  items: CheckoutItem[];
  subtotal: number;
  shipping: number;
  discount?: number;
  tax?: number;
  total: number;
}

export function CheckoutOrderSummary({
  items,
  subtotal,
  shipping,
  discount = 0,
  tax = 0,
  total,
}: CheckoutOrderSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <ScrollArea className='max-h-64'>
          <div className='space-y-3'>
            {items.map((item) => (
              <div key={item.id} className='flex gap-3'>
                <div className='relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted'>
                  <img
                    src={item.image}
                    alt={item.name}
                    className='h-full w-full object-cover'
                  />
                  <span className='absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground'>
                    {item.quantity}
                  </span>
                </div>
                <div className='flex-1'>
                  <p className='text-xs text-muted-foreground'>{item.brand}</p>
                  <p className='line-clamp-1 text-sm font-medium'>
                    {item.name}
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    Size: {item.size}
                  </p>
                </div>
                <div className='text-sm font-medium'>
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <Separator />

        <div className='space-y-2 text-sm'>
          <div className='flex justify-between'>
            <span className='text-muted-foreground'>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-muted-foreground'>Shipping</span>
            <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
          </div>
          {discount > 0 && (
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Discount</span>
              <span className='text-green-600'>-${discount.toFixed(2)}</span>
            </div>
          )}
          {tax > 0 && (
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
          )}
        </div>

        <Separator />

        <div className='flex justify-between font-medium'>
          <span>Total</span>
          <span className='text-lg'>${total.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default CheckoutOrderSummary;
