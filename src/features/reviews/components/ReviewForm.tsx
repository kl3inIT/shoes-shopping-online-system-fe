import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Rating } from './Rating';
import { ImagePlus, X } from 'lucide-react';

export interface ReviewFormData {
  rating: number;
  title: string;
  content: string;
  images: File[];
  keepExistingImageUrls?: string[];
}

export interface ReviewFormProps {
  productName?: string;
  onSubmit?: (data: ReviewFormData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  initialData?: Partial<ReviewFormData>;
  existingImageUrls?: string[];
}

export function ReviewForm({
  productName,
  onSubmit,
  onCancel,
  isSubmitting = false,
  initialData,
  existingImageUrls = [],
}: ReviewFormProps) {
  const { t } = useTranslation();

  const [rating, setRating] = useState(initialData?.rating ?? 0);
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [content, setContent] = useState(initialData?.content ?? '');
  const [images, setImages] = useState<File[]>(initialData?.images ?? []);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] =
    useState<string[]>(existingImageUrls);

  useEffect(() => {
    setRating(initialData?.rating ?? 0);
    setTitle(initialData?.title ?? '');
    setContent(initialData?.content ?? '');
    setImages(initialData?.images ?? []);
    setImagePreviews([]);
    setExistingImages(existingImageUrls);
  }, [
    initialData?.rating,
    initialData?.title,
    initialData?.content,
    initialData?.images,
    existingImageUrls,
  ]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const currentTotal = existingImages.length + images.length;
    const remainingSlots = 5 - currentTotal;

    if (remainingSlots <= 0) {
      alert('You already have the maximum of 5 images.');
      return;
    }

    const filesToAdd = files.slice(0, remainingSlots);
    const newImages = [...images, ...filesToAdd];
    setImages(newImages);

    // Create previews
    const newPreviews = newImages.map((file) => URL.createObjectURL(file));
    setImagePreviews(newPreviews);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert(t('productDetail.reviews.selectRating', 'Please select a rating'));
      return;
    }
    onSubmit?.({
      rating,
      title,
      content,
      images,
      keepExistingImageUrls: existingImages,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t('productDetail.reviews.writeReview', 'Write a Review')}
        </CardTitle>
        {productName && (
          <p className='text-sm text-muted-foreground'>
            {t('productDetail.reviews.forProduct', 'for {{productName}}', {
              productName,
            })}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Rating */}
          <div className='space-y-2'>
            <Label>
              {t('productDetail.reviews.overallRating', 'Overall Rating *')}
            </Label>
            <Rating value={rating} onChange={setRating} size='lg' />
            {rating === 0 && (
              <p className='text-xs text-muted-foreground'>
                {t(
                  'productDetail.reviews.clickToRate',
                  'Click to rate this product'
                )}
              </p>
            )}
          </div>

          {/* Title */}
          <div className='space-y-2'>
            <Label htmlFor='review-title'>
              {t('productDetail.reviews.reviewTitle', 'Review Title')}
            </Label>
            <Input
              id='review-title'
              placeholder={t(
                'productDetail.reviews.reviewTitlePlaceholder',
                'Summarize your review'
              )}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Content */}
          <div className='space-y-2'>
            <Label htmlFor='review-content'>
              {t('productDetail.reviews.yourReview', 'Your Review *')}
            </Label>
            <Textarea
              id='review-content'
              placeholder={t(
                'productDetail.reviews.yourReviewPlaceholder',
                'Share your experience with this product...'
              )}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              required
            />
          </div>

          {/* Images */}
          <div className='space-y-2'>
            <Label>
              {t('productDetail.reviews.addPhotos', 'Add Photos (optional)')}
            </Label>
            <div className='flex flex-wrap gap-2'>
              {existingImages.map((url, index) => (
                <div
                  key={url}
                  className='relative h-20 w-20 overflow-hidden rounded-md'
                >
                  <img
                    src={url}
                    alt='Existing review image'
                    className='h-full w-full object-cover'
                  />
                  <button
                    type='button'
                    onClick={() =>
                      setExistingImages((prev) =>
                        prev.filter((_, i) => i !== index)
                      )
                    }
                    className='absolute right-1 top-1 rounded-full bg-destructive p-1 text-destructive-foreground'
                  >
                    <X className='h-3 w-3' />
                  </button>
                </div>
              ))}
              {imagePreviews.map((preview, index) => (
                <div
                  key={preview}
                  className='relative h-20 w-20 overflow-hidden rounded-md'
                >
                  <img
                    src={preview}
                    alt='Preview'
                    className='h-full w-full object-cover'
                  />
                  <button
                    type='button'
                    onClick={() => removeImage(index)}
                    className='absolute right-1 top-1 rounded-full bg-destructive p-1 text-destructive-foreground'
                  >
                    <X className='h-3 w-3' />
                  </button>
                </div>
              ))}
              {existingImages.length + images.length < 5 && (
                <label className='flex h-20 w-20 cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50'>
                  <input
                    type='file'
                    accept='image/*'
                    multiple
                    onChange={handleImageChange}
                    className='hidden'
                  />
                  <ImagePlus className='h-6 w-6 text-muted-foreground' />
                </label>
              )}
            </div>
            <p className='text-xs text-muted-foreground'>
              {t('productDetail.reviews.maxImages', 'Up to 5 images allowed')}
            </p>
          </div>

          {/* Actions */}
          <div className='flex gap-2 pt-2'>
            <Button type='submit' disabled={isSubmitting || rating === 0}>
              {isSubmitting
                ? t('productDetail.reviews.submitting', 'Submitting...')
                : t('productDetail.reviews.submitReview', 'Submit Review')}
            </Button>
            {onCancel && (
              <Button type='button' variant='outline' onClick={onCancel}>
                {t('common.cancel', 'Cancel')}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default ReviewForm;
