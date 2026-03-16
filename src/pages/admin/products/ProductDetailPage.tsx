import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { IconArrowLeft } from '@tabler/icons-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useShoeById } from '@/features/products';
import { resolveImageUrl } from '@/lib/image';

function getStatusVariant(
  status: string
): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'ACTIVE':
      return 'default';
    case 'OUT_OF_STOCK':
      return 'destructive';
    case 'INACTIVE':
    case 'DISCONTINUED':
      return 'secondary';
    case 'DRAFT':
    default:
      return 'outline';
  }
}

export default function ProductDetailPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { data: shoe, isLoading, isError } = useShoeById(id);

  const gallery = useMemo(
    () => (shoe?.imageUrls ?? []).map((url) => resolveImageUrl(url) ?? url),
    [shoe?.imageUrls]
  );

  const variantGroups = useMemo(() => {
    if (!shoe) {
      return [];
    }

    const grouped = new Map<
      string,
      {
        color: string;
        sizes: string[];
        quantity: number;
        imageUrls: string[];
      }
    >();

    shoe.variants.forEach((variant) => {
      const key = variant.color;
      const existing = grouped.get(key);
      const resolvedImages = (variant.imageUrls ?? []).map(
        (url) => resolveImageUrl(url) ?? url
      );

      if (existing) {
        const sizeValue = String(variant.size);
        if (!existing.sizes.includes(sizeValue)) {
          existing.sizes.push(sizeValue);
        }
        existing.quantity += variant.quantity;
        if (existing.imageUrls.length === 0 && resolvedImages.length > 0) {
          existing.imageUrls = resolvedImages;
        }
      } else {
        grouped.set(key, {
          color: variant.color,
          sizes: [String(variant.size)],
          quantity: variant.quantity,
          imageUrls: resolvedImages,
        });
      }
    });

    return Array.from(grouped.values()).map((group) => ({
      ...group,
      sizes: group.sizes.sort((a, b) => a.localeCompare(b)),
    }));
  }, [shoe]);

  if (isLoading) {
    return (
      <div className='flex flex-1 items-center justify-center'>
        <p className='text-sm text-muted-foreground'>
          {t('common.loading', 'Đang tải...')}
        </p>
      </div>
    );
  }

  if (isError || !shoe) {
    return (
      <div className='flex flex-1 flex-col items-center justify-center gap-3'>
        <p className='text-sm text-destructive'>
          {t(
            'admin.products.detail.loadError',
            'Không thể tải chi tiết sản phẩm'
          )}
        </p>
        <Button variant='outline' onClick={() => navigate('/admin/products')}>
          {t('common.back', 'Quay lại')}
        </Button>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-6 px-4 py-4 lg:px-6'>
      <div className='flex items-center justify-between'>
        <div>
          <p className='text-sm text-muted-foreground'>
            {t('admin.products.detail.breadcrumb', 'Sản phẩm / Chi tiết')}
          </p>
          <h1 className='text-2xl font-bold'>{shoe.name}</h1>
        </div>
        <div className='flex gap-2'>
          <Button variant='outline' onClick={() => navigate('/admin/products')}>
            <IconArrowLeft className='mr-2 h-4 w-4' />
            {t('common.back', 'Quay lại')}
          </Button>
          <Button
            onClick={() =>
              navigate(`/admin/products/${shoe.id}/edit`, {
                state: { from: `/admin/products/${shoe.id}` },
              })
            }
          >
            {t('admin.products.actions.edit')}
          </Button>
        </div>
      </div>

      <div className='grid gap-6 lg:grid-cols-3'>
        <Card className='lg:col-span-2'>
          <CardHeader>
            <CardTitle>
              {t('admin.products.detail.images', 'Hình ảnh sản phẩm')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {gallery.length === 0 ? (
              <div className='flex h-64 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground'>
                {t('admin.products.detail.noImage', 'Chưa có ảnh')}
              </div>
            ) : (
              <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'>
                {gallery.map((url) => (
                  <div
                    key={url}
                    className='aspect-square overflow-hidden rounded-md border bg-muted'
                  >
                    <img
                      src={url}
                      alt={shoe.name}
                      className='h-full w-full object-cover'
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {t('admin.products.detail.info', 'Thông tin chính')}
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3 text-sm'>
            <div className='flex items-center justify-between gap-3'>
              <span className='text-muted-foreground'>Status</span>
              <Badge variant={getStatusVariant(shoe.status)}>
                {shoe.status}
              </Badge>
            </div>
            <div className='flex items-center justify-between gap-3'>
              <span className='text-muted-foreground'>Brand</span>
              <span className='font-medium'>{shoe.brandName}</span>
            </div>
            <div className='flex items-center justify-between gap-3'>
              <span className='text-muted-foreground'>Category</span>
              <span className='font-medium'>{shoe.categoryName}</span>
            </div>
            <div className='flex items-center justify-between gap-3'>
              <span className='text-muted-foreground'>Gender</span>
              <span className='font-medium'>{shoe.gender}</span>
            </div>
            <div className='flex items-center justify-between gap-3'>
              <span className='text-muted-foreground'>Material</span>
              <span className='font-medium'>{shoe.material || '-'}</span>
            </div>
            <div className='flex items-center justify-between gap-3'>
              <span className='text-muted-foreground'>Base price</span>
              <span className='font-semibold'>{shoe.price}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {t('admin.products.detail.description', 'Mô tả')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className='whitespace-pre-wrap text-sm text-muted-foreground'>
            {shoe.description || '-'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {t('admin.products.detail.variants', 'Biến thể')} (
            {shoe.variants.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='rounded-lg border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Size</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead className='text-right'>Stock</TableHead>
                  <TableHead>Images</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {variantGroups.map((group) => (
                  <TableRow key={group.color}>
                    <TableCell>
                      <div className='flex flex-wrap gap-2'>
                        {group.sizes.map((size) => (
                          <span
                            key={size}
                            className='rounded-full border px-2 py-0.5 text-xs font-medium'
                          >
                            {size}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{group.color}</TableCell>
                    <TableCell className='text-right'>
                      {group.quantity}
                    </TableCell>
                    <TableCell>
                      <div className='flex flex-wrap gap-2'>
                        {group.imageUrls.slice(0, 4).map((src) => (
                          <img
                            key={src}
                            src={src}
                            alt={`${shoe.name}-variant`}
                            className='h-10 w-10 rounded object-cover'
                          />
                        ))}
                        {group.imageUrls.length === 0 && (
                          <span className='text-xs text-muted-foreground'>
                            No image
                          </span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
