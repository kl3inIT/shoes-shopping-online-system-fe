import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Rating } from './Rating';
import { ThumbsUp, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from 'react-oidc-context';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export interface ReviewCardProps {
  id: string;
  author: {
    name: string;
    avatar?: string;
  };
  rating: number;
  title?: string;
  content: string;
  createdAt: string;
  isVerifiedPurchase?: boolean;
  helpfulCount?: number;
  images?: string[];
  onHelpful?: (id: string) => void;
  initialHelpful?: boolean;
}

export function ReviewCard({
  id,
  author,
  rating,
  title,
  content,
  createdAt,
  isVerifiedPurchase,
  helpfulCount = 0,
  images = [],
  onHelpful,
  initialHelpful,
}: ReviewCardProps) {
  const [isHelpful, setIsHelpful] = useState(initialHelpful ?? false);
  const auth = useAuth();
  const { t, i18n } = useTranslation();
  const initials = author.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card>
      <CardContent className='pt-6'>
        <div className='flex items-start gap-4'>
          <Avatar className='h-10 w-10'>
            <AvatarImage src={author.avatar} alt={author.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          <div className='flex-1 space-y-2'>
            <div className='flex flex-wrap items-center gap-2'>
              <span className='font-medium'>{author.name}</span>
              {isVerifiedPurchase && (
                <Badge variant='secondary' className='gap-1'>
                  <CheckCircle className='h-3 w-3' />
                  {t('productDetail.reviews.verifiedPurchase')}
                </Badge>
              )}
            </div>

            <div className='flex items-center gap-2'>
              <Rating value={rating} readonly size='sm' />
              <span className='text-xs text-muted-foreground'>
                {new Date(createdAt).toLocaleDateString(
                  i18n.language === 'vi' ? 'vi-VN' : 'en-US',
                  {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }
                )}
              </span>
            </div>

            {title && <h4 className='font-medium'>{title}</h4>}

            <p className='text-sm text-muted-foreground'>{content}</p>

            {images.length > 0 && (
              <div className='flex gap-2 pt-2'>
                {images.map((image, index) => (
                  <div
                    key={index}
                    className='h-16 w-16 overflow-hidden rounded-md bg-muted'
                  >
                    <img
                      src={image}
                      alt={`Review image ${index + 1}`}
                      className='h-full w-full object-cover'
                    />
                  </div>
                ))}
              </div>
            )}

            {onHelpful && (
              <div className='flex items-center gap-4 pt-2'>
                <Button
                  variant='ghost'
                  size='sm'
                  className={`h-8 text-xs ${isHelpful ? 'text-sky-500' : ''}`}
                  onClick={() => {
                    if (!auth.isAuthenticated) {
                      const message =
                        i18n.language === 'vi'
                          ? 'Vui lòng đăng nhập trước khi đánh dấu đánh giá là hữu ích'
                          : 'Please log in before marking a review as helpful';
                      toast.warning(message);
                      return;
                    }
                    setIsHelpful((prev) => !prev);
                    onHelpful(id);
                  }}
                >
                  <ThumbsUp
                    className={`mr-1 h-3 w-3 ${
                      isHelpful ? 'text-sky-500' : ''
                    }`}
                  />
                  {t('productDetail.reviews.helpful')} ({helpfulCount})
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ReviewCard;
