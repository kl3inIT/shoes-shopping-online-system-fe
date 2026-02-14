import { useState } from 'react';
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
}

export interface ReviewFormProps {
  productName?: string;
  onSubmit?: (data: ReviewFormData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export function ReviewForm({
  productName,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 5) {
      alert('Maximum 5 images allowed');
      return;
    }

    const newImages = [...images, ...files].slice(0, 5);
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
      alert('Please select a rating');
      return;
    }
    onSubmit?.({ rating, title, content, images });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
        {productName && (
          <p className='text-sm text-muted-foreground'>for {productName}</p>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Rating */}
          <div className='space-y-2'>
            <Label>Overall Rating *</Label>
            <Rating value={rating} onChange={setRating} size='lg' />
            {rating === 0 && (
              <p className='text-xs text-muted-foreground'>
                Click to rate this product
              </p>
            )}
          </div>

          {/* Title */}
          <div className='space-y-2'>
            <Label htmlFor='review-title'>Review Title</Label>
            <Input
              id='review-title'
              placeholder='Summarize your review'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Content */}
          <div className='space-y-2'>
            <Label htmlFor='review-content'>Your Review *</Label>
            <Textarea
              id='review-content'
              placeholder='Share your experience with this product...'
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              required
            />
          </div>

          {/* Images */}
          <div className='space-y-2'>
            <Label>Add Photos (optional)</Label>
            <div className='flex flex-wrap gap-2'>
              {imagePreviews.map((preview, index) => (
                <div
                  key={index}
                  className='relative h-20 w-20 overflow-hidden rounded-md'
                >
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
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
              {images.length < 5 && (
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
              Up to 5 images allowed
            </p>
          </div>

          {/* Actions */}
          <div className='flex gap-2 pt-2'>
            <Button type='submit' disabled={isSubmitting || rating === 0}>
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
            {onCancel && (
              <Button type='button' variant='outline' onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default ReviewForm;
