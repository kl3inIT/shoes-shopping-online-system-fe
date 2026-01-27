import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Package, ChevronRight } from 'lucide-react';

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
  size: string;
  quantity: number;
}

export interface OrderCardProps {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  createdAt: string;
  items: OrderItem[];
  total: number;
  onViewDetails?: (orderId: string) => void;
  onTrackOrder?: (orderId: string) => void;
  onReorder?: (orderId: string) => void;
}

const statusConfig: Record<
  OrderStatus,
  {
    label: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
  }
> = {
  pending: { label: 'Pending', variant: 'secondary' },
  processing: { label: 'Processing', variant: 'default' },
  shipped: { label: 'Shipped', variant: 'default' },
  delivered: { label: 'Delivered', variant: 'outline' },
  cancelled: { label: 'Cancelled', variant: 'destructive' },
};

export function OrderCard({
  id,
  orderNumber,
  status,
  createdAt,
  items,
  total,
  onViewDetails,
  onTrackOrder,
  onReorder,
}: OrderCardProps) {
  const statusInfo = statusConfig[status];
  const displayItems = items.slice(0, 2);
  const remainingCount = items.length - 2;

  return (
    <Card>
      <CardHeader className='pb-3'>
        <div className='flex flex-wrap items-center justify-between gap-2'>
          <div className='flex items-center gap-2'>
            <Package className='h-4 w-4 text-muted-foreground' />
            <span className='font-medium'>Order #{orderNumber}</span>
          </div>
          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
        </div>
        <p className='text-sm text-muted-foreground'>
          Placed on{' '}
          {new Date(createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </CardHeader>
      <Separator />
      <CardContent className='pt-4'>
        <div className='space-y-3'>
          {displayItems.map((item) => (
            <div key={item.id} className='flex gap-3'>
              <div className='h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted'>
                <img
                  src={item.image}
                  alt={item.name}
                  className='h-full w-full object-cover'
                />
              </div>
              <div className='flex-1'>
                <p className='line-clamp-1 font-medium'>{item.name}</p>
                <p className='text-sm text-muted-foreground'>
                  Size: {item.size} × {item.quantity}
                </p>
                <p className='text-sm font-medium'>
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
          {remainingCount > 0 && (
            <p className='text-sm text-muted-foreground'>
              +{remainingCount} more item{remainingCount > 1 ? 's' : ''}
            </p>
          )}
        </div>

        <Separator className='my-4' />

        <div className='flex items-center justify-between'>
          <div>
            <p className='text-sm text-muted-foreground'>Total</p>
            <p className='text-lg font-bold'>${total.toFixed(2)}</p>
          </div>
          <div className='flex flex-wrap gap-2'>
            {status === 'shipped' && onTrackOrder && (
              <Button
                size='sm'
                variant='outline'
                onClick={() => onTrackOrder(id)}
              >
                Track Order
              </Button>
            )}
            {status === 'delivered' && onReorder && (
              <Button size='sm' variant='outline' onClick={() => onReorder(id)}>
                Reorder
              </Button>
            )}
            <Button size='sm' onClick={() => onViewDetails?.(id)}>
              View Details
              <ChevronRight className='ml-1 h-4 w-4' />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default OrderCard;
