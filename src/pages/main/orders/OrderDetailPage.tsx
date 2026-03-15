import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft } from 'lucide-react';

import { PageErrorState, PageLoader } from '@/components/app';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getErrorMessage } from '@/features/apiClient';
import {
  OrderTimeline,
  type OrderStatus,
  useOrderDetailQuery,
} from '@/features/orders';
import {
  ReviewForm,
  type ReviewFormData,
  useCreateReviewMutation,
  useReviewEligibility,
  useUpdateReviewMutation,
} from '@/features/reviews';
import { getReviewEligibility } from '@/features/reviews/api';
import type { ReviewEligibilityDto } from '@/features/reviews/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { getOrderTimeline } from './data';

function getStatusTranslationKey(status: OrderStatus): string {
  switch (status) {
    case 'CONFIRMED':
      return 'orders.filter.confirmed';
    case 'DELIVERED':
      return 'orders.filter.delivered';
    case 'CANCELLED':
      return 'orders.filter.cancelled';
    case 'SHIPPED':
      return 'orders.filter.shipped';
    case 'PAID':
      return 'orders.filter.processing';
    case 'PENDING_PAYMENT':
      return 'orders.filter.pending';
    case 'PAYMENT_EXPIRED':
      return 'orders.filter.cancelled';
    case 'REFUNDED':
      return 'orders.filter.cancelled';
    default:
      return 'orders.filter.pending';
  }
}

export function OrderDetailPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const { order, isLoading, isFetching, error } = useOrderDetailQuery(orderId);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewTarget, setReviewTarget] = useState<{
    orderDetailId: string;
    shoeVariantId: string;
    productName: string;
  } | null>(null);
  const [itemEligibility, setItemEligibility] = useState<
    Record<string, ReviewEligibilityDto>
  >({});

  const { data: eligibility } = useReviewEligibility(
    reviewTarget?.orderDetailId ?? null,
    reviewTarget?.shoeVariantId ?? null,
    !!reviewTarget
  );
  const createReviewMutation = useCreateReviewMutation();
  const updateReviewMutation = useUpdateReviewMutation();

  const timeline = useMemo(
    () => (order ? getOrderTimeline(order.status, (key) => t(key)) : []),
    [order, t]
  );

  const refreshItemEligibility = async (
    orderDetailId: string,
    shoeVariantId: string
  ) => {
    try {
      const data = await getReviewEligibility(orderDetailId, shoeVariantId);
      setItemEligibility((prev) => ({
        ...prev,
        [orderDetailId]: data,
      }));
    } catch {
      // ignore refresh errors for now
    }
  };

  useEffect(() => {
    if (!order) return;

    const fetchAll = async () => {
      try {
        const entries = await Promise.all(
          order.items
            .filter((item) => item.shoeVariantId)
            .map(async (item) => {
              const data = await getReviewEligibility(
                item.id,
                item.shoeVariantId as string
              );
              return [item.id, data] as const;
            })
        );
        setItemEligibility(Object.fromEntries(entries));
      } catch {
        // best-effort, ignore errors here
      }
    };

    void fetchAll();
  }, [order]);

  useEffect(() => {
    if (!reviewTarget || !eligibility) return;

    if (eligibility.alreadyReviewed && eligibility.canEdit) {
      setItemEligibility((prev) => ({
        ...prev,
        [reviewTarget.orderDetailId]: eligibility,
      }));
    }
  }, [eligibility, reviewTarget]);

  const isLoadingState = isLoading || isFetching;

  const handleOpenReview = (item: {
    id: string;
    shoeVariantId: string | null;
    name: string;
  }) => {
    if (!item.shoeVariantId) return;
    setReviewTarget({
      orderDetailId: item.id,
      shoeVariantId: item.shoeVariantId,
      productName: item.name,
    });
    setReviewDialogOpen(true);
  };

  const handleSubmitReview = (data: ReviewFormData) => {
    if (!reviewTarget || !eligibility) return;

    const existingReview = eligibility.review;
    const canEdit = eligibility.canEdit && !!existingReview;
    const isEditing = !!existingReview && canEdit;

    if (!isEditing && !eligibility.eligible) return;

    const description = data.title?.trim()
      ? `${data.title.trim()}\n\n${data.content}`
      : data.content;

    if (isEditing) {
      updateReviewMutation.mutate(
        {
          reviewId: existingReview!.id,
          numberStars: data.rating,
          description,
          images: data.images,
          keepImageUrls: data.keepExistingImageUrls ?? [],
        },
        {
          onSuccess: () => {
            void refreshItemEligibility(
              reviewTarget.orderDetailId,
              reviewTarget.shoeVariantId
            );
            setReviewDialogOpen(false);
            window.location.reload();
          },
        }
      );
    } else {
      createReviewMutation.mutate(
        {
          orderDetailId: reviewTarget.orderDetailId,
          shoeVariantId: reviewTarget.shoeVariantId,
          numberStars: data.rating,
          description,
          images: data.images,
        },
        {
          onSuccess: () => {
            void refreshItemEligibility(
              reviewTarget.orderDetailId,
              reviewTarget.shoeVariantId
            );
            setReviewDialogOpen(false);
            window.location.reload();
          },
        }
      );
    }
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-6 flex items-center justify-between'>
        <Button variant='ghost' onClick={() => navigate(-1)}>
          <ArrowLeft className='mr-2 h-4 w-4' />
          {t('common.back')}
        </Button>
      </div>

      {isLoadingState && (
        <PageLoader
          title={t('common.loading', 'Loading...')}
          description={t('orders.loadingDetail', 'Loading order details.')}
        />
      )}

      {error && !isLoadingState && (
        <PageErrorState
          title={t('orders.detail.errorTitle', 'Unable to load order')}
          description={getErrorMessage(error)}
        />
      )}

      {!isLoadingState && !error && !order && (
        <p className='text-sm text-muted-foreground'>
          {t('orders.detail.notFound', 'Order not found')}
        </p>
      )}

      {order && (
        <div className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle className='flex flex-wrap items-center justify-between gap-2'>
                <span>
                  {t('orders.orderNumber', { number: order.orderNumber })}
                </span>
                <span className='text-sm font-medium text-muted-foreground'>
                  {t('orders.statusLabel', 'Status')}:{' '}
                  {t(getStatusTranslationKey(order.status))}
                </span>
              </CardTitle>
              <p className='text-sm text-muted-foreground'>
                {t('orders.placedOn', {
                  date: new Date(order.createdAt).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }),
                })}
              </p>
            </CardHeader>

            <CardContent className='space-y-4'>
              <div>
                <h3 className='mb-2 text-sm font-semibold'>
                  {t('orders.items', 'Order items')}
                </h3>
                <div className='space-y-3'>
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className='flex items-center gap-3 rounded-md border p-3'
                    >
                      <div className='h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted'>
                        <img
                          src={item.image}
                          alt={item.name}
                          className='h-full w-full object-cover'
                        />
                      </div>
                      <div className='flex-1'>
                        <p className='font-medium'>{item.name}</p>
                        <p className='text-xs text-muted-foreground'>
                          {t('cart.item.size')}: {item.size} x {item.quantity}
                        </p>
                      </div>
                      <div className='flex flex-col items-end gap-2 text-right'>
                        <div className='text-sm font-semibold'>
                          {(item.price * item.quantity).toLocaleString('vi-VN')}{' '}
                          VND
                        </div>
                        {order.status === 'DELIVERED' &&
                          (() => {
                            const eligibilityForItem = itemEligibility[item.id];

                            if (!eligibilityForItem) {
                              return (
                                <Button
                                  size='sm'
                                  variant='outline'
                                  onClick={() =>
                                    handleOpenReview({
                                      id: item.id,
                                      shoeVariantId: item.shoeVariantId ?? null,
                                      name: item.name,
                                    })
                                  }
                                >
                                  {t(
                                    'productDetail.reviews.writeReview',
                                    'Đánh giá'
                                  )}
                                </Button>
                              );
                            }

                            if (eligibilityForItem.alreadyReviewed) {
                              if (eligibilityForItem.canEdit) {
                                return (
                                  <Button
                                    size='sm'
                                    variant='ghost'
                                    onClick={() =>
                                      handleOpenReview({
                                        id: item.id,
                                        shoeVariantId:
                                          item.shoeVariantId ?? null,
                                        name: item.name,
                                      })
                                    }
                                  >
                                    {t(
                                      'productDetail.reviews.editReview',
                                      'Sửa đánh giá'
                                    )}
                                  </Button>
                                );
                              }

                              return (
                                <span className='text-xs font-medium text-muted-foreground'>
                                  {t(
                                    'productDetail.reviews.alreadyReviewed',
                                    'Đã đánh giá'
                                  )}
                                </span>
                              );
                            }

                            if (eligibilityForItem.eligible) {
                              return (
                                <Button
                                  size='sm'
                                  variant='outline'
                                  onClick={() =>
                                    handleOpenReview({
                                      id: item.id,
                                      shoeVariantId: item.shoeVariantId ?? null,
                                      name: item.name,
                                    })
                                  }
                                >
                                  {t(
                                    'productDetail.reviews.writeReview',
                                    'Đánh giá'
                                  )}
                                </Button>
                              );
                            }

                            return null;
                          })()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>
                  {t('orders.total', 'Total')}
                </span>
                <span className='text-lg font-bold'>
                  {order.total.toLocaleString('vi-VN')} VND
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {t('orders.timeline.title', {
                  number: order.orderNumber,
                })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <OrderTimeline steps={timeline} />
            </CardContent>
          </Card>
        </div>
      )}

      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className='sm:max-w-lg'>
          <DialogHeader>
            <DialogTitle>
              {t('productDetail.reviews.writeReview', 'Viết đánh giá')}
            </DialogTitle>
          </DialogHeader>
          {reviewTarget && (
            <ReviewForm
              productName={reviewTarget.productName}
              initialData={(() => {
                const existingReview = eligibility?.review;
                if (!existingReview) return undefined;

                const description = existingReview.description ?? '';
                const separator = '\n\n';
                const hasSeparator = description.includes(separator);

                const title = hasSeparator
                  ? description.substring(0, description.indexOf(separator))
                  : '';
                const content = hasSeparator
                  ? description.substring(
                      description.indexOf(separator) + separator.length
                    )
                  : description;

                return {
                  rating: existingReview.numberStars,
                  title,
                  content,
                  images: [],
                };
              })()}
              existingImageUrls={eligibility?.review?.imageUrls ?? []}
              onSubmit={handleSubmitReview}
              onCancel={() => setReviewDialogOpen(false)}
              isSubmitting={
                createReviewMutation.isPending || updateReviewMutation.isPending
              }
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default OrderDetailPage;
