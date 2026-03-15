import { useTranslation } from 'react-i18next';
import {
  IconStar,
  IconStarFilled,
  IconEye,
  IconEyeOff,
} from '@tabler/icons-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

import type { AdminReviewTableItem } from './ReviewTable';

interface ReviewDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  review: AdminReviewTableItem | null;
  onToggleVisibility?: (reviewId: string, visible: boolean) => void;
}

export function ReviewDetailDialog({
  open,
  onOpenChange,
  review,
  onToggleVisibility,
}: ReviewDetailDialogProps) {
  const { t } = useTranslation();

  const getVisibilityBadge = (visible: boolean) =>
    visible ? (
      <Badge className='bg-green-500'>
        {t('admin.reviews.visibility.visible')}
      </Badge>
    ) : (
      <Badge variant='destructive'>
        {t('admin.reviews.visibility.hidden')}
      </Badge>
    );

  const renderStars = (rating: number) => {
    return (
      <div className='flex items-center gap-0.5'>
        {[1, 2, 3, 4, 5].map((star) =>
          star <= rating ? (
            <IconStarFilled key={star} className='h-4 w-4 text-yellow-500' />
          ) : (
            <IconStar key={star} className='h-4 w-4 text-gray-300' />
          )
        )}
      </div>
    );
  };

  if (!review) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-lg'>
        <DialogHeader>
          <DialogTitle>{t('admin.reviews.detail.title')}</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          {/* Customer */}
          <div className='flex items-center gap-3'>
            <Avatar>
              <AvatarImage src={review.customer.avatarUrl} />
              <AvatarFallback>{review.customer.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className='font-medium'>{review.customer.name}</p>
              <p className='text-sm text-muted-foreground'>
                {review.customer.email}
              </p>
            </div>
          </div>

          <Separator />

          {/* Product */}
          <div className='flex items-center gap-3'>
            <img
              src={review.product.imageUrl}
              alt={review.product.name}
              className='h-16 w-16 rounded-md object-cover'
            />
            <div>
              <p className='font-medium'>{review.product.name}</p>
              {review.order && (
                <p className='text-sm text-muted-foreground'>
                  {t('admin.reviews.detail.order')}: {review.order.orderNumber}
                </p>
              )}
            </div>
          </div>

          <Separator />

          {/* Rating & Comment */}
          <div>
            <div className='mb-2 flex items-center gap-2'>
              {renderStars(review.rating)}
              <span className='text-sm text-muted-foreground'>
                {review.rating}/5
              </span>
            </div>
            <p className='text-sm'>{review.comment}</p>
          </div>

          <Separator />

          {/* Visibility & Actions */}
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <span className='text-sm text-muted-foreground'>
                {t('admin.reviews.detail.visibility')}:
              </span>
              {getVisibilityBadge(review.visible)}
            </div>
            <div className='flex gap-2'>
              <Button
                size='sm'
                variant={review.visible ? 'destructive' : 'default'}
                onClick={() => {
                  onToggleVisibility?.(review.id, !review.visible);
                  onOpenChange(false);
                }}
              >
                {review.visible ? (
                  <>
                    <IconEyeOff className='mr-1 h-4 w-4' />
                    {t('admin.reviews.actions.hide')}
                  </>
                ) : (
                  <>
                    <IconEye className='mr-1 h-4 w-4' />
                    {t('admin.reviews.actions.show')}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
