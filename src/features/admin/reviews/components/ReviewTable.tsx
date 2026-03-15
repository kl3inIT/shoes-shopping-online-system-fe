import { useTranslation } from 'react-i18next';
import {
  IconDots,
  IconStar,
  IconStarFilled,
  IconEye,
  IconEyeOff,
} from '@tabler/icons-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface AdminReviewTableItem {
  id: string;
  customer: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
  };
  product: {
    id: string;
    name: string;
    imageUrl: string;
  };
  order?: {
    id: string;
    orderNumber: string;
  };
  rating: number;
  comment: string;
  visible: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ReviewTableProps {
  reviews: AdminReviewTableItem[];
  onViewDetails?: (review: AdminReviewTableItem) => void;
  onToggleVisibility?: (reviewId: string, visible: boolean) => void;
}

export function ReviewTable({
  reviews,
  onViewDetails,
  onToggleVisibility,
}: ReviewTableProps) {
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

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className='rounded-lg border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('admin.reviews.table.customer')}</TableHead>
            <TableHead>{t('admin.reviews.table.product')}</TableHead>
            <TableHead>{t('admin.reviews.table.rating')}</TableHead>
            <TableHead className='max-w-[300px]'>
              {t('admin.reviews.table.comment')}
            </TableHead>
            <TableHead>{t('admin.reviews.table.visibility')}</TableHead>
            <TableHead>{t('admin.reviews.table.date')}</TableHead>
            <TableHead className='text-right'>
              {t('admin.reviews.table.actions')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviews.map((review) => (
            <TableRow key={review.id}>
              <TableCell>
                <div className='flex items-center gap-2'>
                  <Avatar className='h-8 w-8'>
                    <AvatarImage src={review.customer.avatarUrl} />
                    <AvatarFallback>{review.customer.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className='font-medium'>{review.customer.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className='flex items-center gap-2'>
                  <img
                    src={review.product.imageUrl}
                    alt={review.product.name}
                    className='h-8 w-8 rounded object-cover'
                  />
                  <span className='text-sm'>{review.product.name}</span>
                </div>
              </TableCell>
              <TableCell>{renderStars(review.rating)}</TableCell>
              <TableCell className='max-w-[300px]'>
                <p className='line-clamp-2 text-sm'>{review.comment}</p>
              </TableCell>
              <TableCell>{getVisibilityBadge(review.visible)}</TableCell>
              <TableCell className='text-sm text-muted-foreground'>
                {formatDateTime(review.updatedAt || review.createdAt)}
              </TableCell>
              <TableCell className='text-right'>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='ghost' size='icon'>
                      <IconDots className='h-4 w-4' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem onClick={() => onViewDetails?.(review)}>
                      <IconEye className='mr-2 h-4 w-4' />
                      {t('admin.reviews.actions.viewDetails')}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() =>
                        onToggleVisibility?.(review.id, !review.visible)
                      }
                    >
                      {review.visible ? (
                        <>
                          <IconEyeOff className='mr-2 h-4 w-4' />
                          {t('admin.reviews.actions.hide')}
                        </>
                      ) : (
                        <>
                          <IconEye className='mr-2 h-4 w-4' />
                          {t('admin.reviews.actions.show')}
                        </>
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
