import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router';
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IconTrash, IconX, IconPlus } from '@tabler/icons-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  genderOptions,
  statusOptions,
  type Gender,
  type ProductStatus as ShoeStatus,
} from './data';
import { useBrands, useCategories, useShoeById } from '@/features/products';
import { useUpdateShoeMutation } from '@/features/admin/products';

type ImageItem = {
  id: string;
  type: 'existing' | 'new';
  value: string;
};

interface VariantFormState {
  id: string;
  size: string;
  color: string;
  stockQuantity: string;
  existingImageUrls: string[];
  keepImageUrls: string[];
  newImages: File[];
  newPreviewUrls: string[];
  imageOrder: ImageItem[];
}

interface ShoeFormState {
  name: string;
  brandId: string;
  categoryId: string;
  gender: Gender;
  status: ShoeStatus;
  basePrice: string;
  material: string;
  description: string;
}

function SortableImageItem({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={isDragging ? 'z-10 opacity-80' : ''}
      {...attributes}
      {...listeners}
    >
      <div className='relative'>{children}</div>
    </div>
  );
}

export default function EditShoePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const backTo = (location.state as { from?: string } | null)?.from;

  const { data: brands = [] } = useBrands();
  const { data: categories = [] } = useCategories();
  const { data: shoeData, isLoading, isError } = useShoeById(id);

  const [shoe, setShoe] = useState<ShoeFormState | null>(null);
  const [variants, setVariants] = useState<VariantFormState[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shoeExistingImageUrls, setShoeExistingImageUrls] = useState<string[]>(
    []
  );
  const [shoeKeepImageUrls, setShoeKeepImageUrls] = useState<string[]>([]);
  const [shoeNewImages, setShoeNewImages] = useState<File[]>([]);
  const [shoeNewPreviewUrls, setShoeNewPreviewUrls] = useState<string[]>([]);
  const [shoeImageOrder, setShoeImageOrder] = useState<ImageItem[]>([]);
  const mainImageInputRef = useRef<HTMLInputElement | null>(null);

  const updateShoeMutation = useUpdateShoeMutation();

  useEffect(() => {
    if (!shoeData) return;

    setShoe({
      name: shoeData.name,
      brandId: shoeData.brandId,
      categoryId: shoeData.categoryId,
      gender: shoeData.gender as Gender,
      status: shoeData.status as ShoeStatus,
      basePrice: String(shoeData.price),
      material: shoeData.material,
      description: shoeData.description,
    });

    const initialShoeImages = shoeData.imageUrls ?? [];

    setShoeExistingImageUrls(initialShoeImages);
    setShoeKeepImageUrls(initialShoeImages);
    setShoeImageOrder(
      initialShoeImages.map((url) => ({
        id: `existing:${url}`,
        type: 'existing',
        value: url,
      }))
    );

    setVariants(
      shoeData.variants.map((v) => ({
        id: v.id,
        size: v.size,
        color: v.color,
        stockQuantity: String(v.quantity),
        existingImageUrls: v.imageUrls ?? [],
        keepImageUrls: v.imageUrls ?? [],
        newImages: [],
        newPreviewUrls: [],
        imageOrder: (v.imageUrls ?? []).map((url) => ({
          id: `existing:${url}`,
          type: 'existing',
          value: url,
        })),
      }))
    );
  }, [shoeData]);

  useEffect(() => {
    return () => {
      shoeNewPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
      variants.forEach((v) =>
        v.newPreviewUrls.forEach((url) => URL.revokeObjectURL(url))
      );
    };
  }, [shoeNewPreviewUrls, variants]);

  const totalStock = useMemo(
    () => variants.reduce((sum, v) => sum + (Number(v.stockQuantity) || 0), 0),
    [variants]
  );

  const handleChange =
    (field: keyof ShoeFormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;

      setShoe((prev) =>
        prev
          ? {
              ...prev,
              [field]: value,
            }
          : prev
      );
    };

  const handleSelectChange =
    (field: keyof ShoeFormState) => (value: string) => {
      setShoe((prev) =>
        prev
          ? {
              ...prev,
              [field]: value,
            }
          : prev
      );
    };

  const handleVariantChange =
    (id: string, field: keyof VariantFormState) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setVariants((prev) =>
        prev.map((variant) =>
          variant.id === id ? { ...variant, [field]: value } : variant
        )
      );
    };

  const handleRemoveVariantAt = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        size: '',
        color: '',
        stockQuantity: '0',
        existingImageUrls: [],
        keepImageUrls: [],
        newImages: [],
        newPreviewUrls: [],
        imageOrder: [],
      },
    ]);
  };

  const handleChooseMainImage = () => {
    mainImageInputRef.current?.click();
  };

  const handleMainImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    const newItems: ImageItem[] = newPreviewUrls.map((preview) => ({
      id: `new:${preview}`,
      type: 'new',
      value: preview,
    }));

    setShoeNewImages((prev) => [...prev, ...files]);
    setShoeNewPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    setShoeImageOrder((prev) => [...prev, ...newItems]);

    if (mainImageInputRef.current) mainImageInputRef.current.value = '';
  };

  const removeNewShoeImage = (previewUrl: string) => {
    const targetIndex = shoeNewPreviewUrls.indexOf(previewUrl);
    if (targetIndex < 0) return;

    URL.revokeObjectURL(shoeNewPreviewUrls[targetIndex]);
    setShoeNewImages((prev) => prev.filter((_, i) => i !== targetIndex));
    setShoeNewPreviewUrls((prev) => prev.filter((_, i) => i !== targetIndex));
    setShoeImageOrder((prev) =>
      prev.filter((item) => item.id !== `new:${previewUrl}`)
    );
  };

  useEffect(() => {
    if (shoeImageOrder.length > 0) return;

    const fallback = [
      ...shoeExistingImageUrls.map((url) => ({
        id: `existing:${url}`,
        type: 'existing' as const,
        value: url,
      })),
      ...shoeNewPreviewUrls.map((url) => ({
        id: `new:${url}`,
        type: 'new' as const,
        value: url,
      })),
    ];

    if (fallback.length > 0) {
      setShoeImageOrder(fallback);
    }
  }, [shoeExistingImageUrls, shoeNewPreviewUrls, shoeImageOrder.length]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    })
  );

  const removeExistingShoeImage = (url: string) => {
    setShoeExistingImageUrls((prev) => prev.filter((u) => u !== url));
    setShoeKeepImageUrls((prev) => prev.filter((u) => u !== url));
    setShoeImageOrder((prev) =>
      prev.filter((item) => item.id !== `existing:${url}`)
    );
  };

  const handleShoeImagesDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;

    setShoeImageOrder((prev) => {
      const oldIndex = prev.findIndex((item) => item.id === String(active.id));
      const newIndex = prev.findIndex((item) => item.id === String(over.id));
      if (oldIndex < 0 || newIndex < 0) return prev;

      const reordered = arrayMove(prev, oldIndex, newIndex);
      const reorderedExisting = reordered
        .filter((item) => item.type === 'existing')
        .map((item) => item.value);
      const reorderedNew = reordered
        .filter((item) => item.type === 'new')
        .map((item) => item.value);

      setShoeExistingImageUrls(reorderedExisting);
      setShoeKeepImageUrls((prevKeep) =>
        reorderedExisting.filter((url) => prevKeep.includes(url))
      );

      const newImageByPreview = new Map(
        shoeNewPreviewUrls.map((preview, index) => [
          preview,
          shoeNewImages[index],
        ])
      );
      setShoeNewPreviewUrls(reorderedNew);
      setShoeNewImages(
        reorderedNew
          .map((preview) => newImageByPreview.get(preview))
          .filter((file): file is File => Boolean(file))
      );

      return reordered;
    });
  };

  const handleVariantImageChange = (
    variantId: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    const newItems: ImageItem[] = newPreviewUrls.map((preview) => ({
      id: `new:${preview}`,
      type: 'new',
      value: preview,
    }));

    setVariants((prev) =>
      prev.map((v) =>
        v.id === variantId
          ? {
              ...v,
              newImages: [...v.newImages, ...files],
              newPreviewUrls: [...v.newPreviewUrls, ...newPreviewUrls],
              imageOrder: [...v.imageOrder, ...newItems],
            }
          : v
      )
    );

    event.target.value = '';
  };

  const removeVariantNewImageByUrl = (
    variantId: string,
    previewUrl: string
  ) => {
    setVariants((prev) =>
      prev.map((v) => {
        if (v.id !== variantId) return v;

        const imageIndex = v.newPreviewUrls.indexOf(previewUrl);
        if (imageIndex < 0) return v;

        URL.revokeObjectURL(v.newPreviewUrls[imageIndex]);
        return {
          ...v,
          newImages: v.newImages.filter((_, i) => i !== imageIndex),
          newPreviewUrls: v.newPreviewUrls.filter((_, i) => i !== imageIndex),
          imageOrder: v.imageOrder.filter(
            (item) => item.id !== `new:${previewUrl}`
          ),
        };
      })
    );
  };

  const removeVariantExistingImage = (variantId: string, url: string) => {
    setVariants((prev) =>
      prev.map((v) =>
        v.id === variantId
          ? {
              ...v,
              existingImageUrls: v.existingImageUrls.filter((u) => u !== url),
              keepImageUrls: v.keepImageUrls.filter((u) => u !== url),
              imageOrder: v.imageOrder.filter(
                (item) => item.id !== `existing:${url}`
              ),
            }
          : v
      )
    );
  };

  useEffect(() => {
    setVariants((prev) => {
      let updated = false;
      const next = prev.map((variant) => {
        if (variant.imageOrder.length > 0) return variant;

        const fallback = [
          ...variant.existingImageUrls.map((url) => ({
            id: `existing:${url}`,
            type: 'existing' as const,
            value: url,
          })),
          ...variant.newPreviewUrls.map((url) => ({
            id: `new:${url}`,
            type: 'new' as const,
            value: url,
          })),
        ];

        if (fallback.length === 0) return variant;

        updated = true;
        return {
          ...variant,
          imageOrder: fallback,
        };
      });

      return updated ? next : prev;
    });
  }, [variants.length]);

  const handleVariantImagesDragEnd =
    (variantId: string) =>
    ({ active, over }: DragEndEvent) => {
      if (!over || active.id === over.id) return;

      setVariants((prev) =>
        prev.map((v) => {
          if (v.id !== variantId) return v;

          const oldIndex = v.imageOrder.findIndex(
            (item) => item.id === String(active.id)
          );
          const newIndex = v.imageOrder.findIndex(
            (item) => item.id === String(over.id)
          );
          if (oldIndex < 0 || newIndex < 0) return v;

          const reordered = arrayMove(v.imageOrder, oldIndex, newIndex);
          const reorderedExisting = reordered
            .filter((item) => item.type === 'existing')
            .map((item) => item.value);
          const reorderedNew = reordered
            .filter((item) => item.type === 'new')
            .map((item) => item.value);

          const newImageByPreview = new Map(
            v.newPreviewUrls.map((preview, index) => [
              preview,
              v.newImages[index],
            ])
          );

          return {
            ...v,
            existingImageUrls: reorderedExisting,
            keepImageUrls: reorderedExisting.filter((url) =>
              v.keepImageUrls.includes(url)
            ),
            newPreviewUrls: reorderedNew,
            newImages: reorderedNew
              .map((preview) => newImageByPreview.get(preview))
              .filter((file): file is File => Boolean(file)),
            imageOrder: reordered,
          };
        })
      );
    };

  const handleCancel = () => {
    navigate(backTo || '/admin/products');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!shoe || !id || isSubmitting) return;

    if (!shoe.name || !shoe.brandId || !shoe.categoryId || !shoe.basePrice) {
      toast.error('Vui lòng điền đầy đủ các trường bắt buộc');
      return;
    }

    const seenVariants = new Set<string>();
    for (const variant of variants) {
      const sizeKey = variant.size.trim().toLowerCase();
      const colorKey = variant.color.trim().toLowerCase();
      const key = `${sizeKey}|${colorKey}`;

      if (!sizeKey || !colorKey) {
        toast.error('Vui lòng nhập đầy đủ size và màu cho biến thể');
        return;
      }

      if (seenVariants.has(key)) {
        toast.error('Không được trùng size và màu giữa các biến thể');
        return;
      }

      seenVariants.add(key);
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: shoe.name,
        description: shoe.description,
        material: shoe.material,
        gender: shoe.gender,
        status: shoe.status,
        categoryId: shoe.categoryId,
        brandId: shoe.brandId,
        price: Number(shoe.basePrice) || 0,
        variants: variants.map((v) => ({
          id: v.existingImageUrls.length > 0 ? v.id : undefined,
          size: v.size,
          color: v.color,
          quantity: Number(v.stockQuantity) || 0,
        })),
        keepShoeImageUrls: shoeKeepImageUrls,
        variantImageUpdates: variants
          .filter((v) => v.existingImageUrls.length > 0)
          .map((v) => ({
            variantId: v.id,
            keepImageUrls: v.keepImageUrls,
          })),
      };

      await updateShoeMutation.mutateAsync({
        id,
        payload,
        shoeImages: shoeNewImages,
        variantImages: variants.map((v) => v.newImages),
      });
      toast.success('Cập nhật sản phẩm thành công!');
      navigate(backTo || `/admin/products/${id}`);
    } catch (error) {
      console.error('Failed to update shoe:', error);
      toast.error('Có lỗi xảy ra khi cập nhật sản phẩm');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !shoe) {
    return (
      <div className='flex flex-1 items-center justify-center'>
        <p className='text-sm text-muted-foreground'>
          {t('common.loading', 'Đang tải dữ liệu sản phẩm...')}
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='flex flex-1 flex-col items-center justify-center gap-2'>
        <p className='text-sm text-destructive'>
          {t(
            'admin.products.editPage.loadError',
            'Không thể tải dữ liệu sản phẩm'
          )}
        </p>
        <Button variant='outline' onClick={handleCancel}>
          {t('common.back', 'Quay lại')}
        </Button>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-6 px-4 py-4 lg:px-6'>
      <div>
        <p className='text-sm font-medium text-muted-foreground'>
          {t('admin.products.editPage.breadcrumb', 'Sản phẩm / Chỉnh sửa')}
        </p>
        <h1 className='mt-1 text-2xl font-bold'>
          {t('admin.products.editPage.title', 'Chỉnh sửa sản phẩm')}
        </h1>
        <p className='text-sm text-muted-foreground'>
          {t(
            'admin.products.editPage.subtitle',
            'Cập nhật thông tin chi tiết cho sản phẩm'
          )}
        </p>
      </div>

      <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
        <div className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>
                {t('admin.products.addPage.sections.generalInfo')}
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='name'>
                  {t('admin.products.addPage.fields.name.label')}
                </Label>
                <Input
                  id='name'
                  value={shoe.name}
                  onChange={handleChange('name')}
                  placeholder={t(
                    'admin.products.addPage.fields.name.placeholder'
                  )}
                />
              </div>

              <div className='grid gap-4 md:grid-cols-2'>
                <div className='space-y-2'>
                  <Label>
                    {t('admin.products.addPage.fields.brand.label')}
                  </Label>
                  <Select
                    value={shoe.brandId}
                    onValueChange={handleSelectChange('brandId')}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue
                        placeholder={t(
                          'admin.products.addPage.fields.brand.placeholder'
                        )}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map((b) => (
                        <SelectItem key={b.id} value={b.id}>
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-2'>
                  <Label>
                    {t('admin.products.addPage.fields.gender.label')}
                  </Label>
                  <Select
                    value={shoe.gender}
                    onValueChange={handleSelectChange('gender')}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue
                        placeholder={t(
                          'admin.products.addPage.fields.gender.placeholder'
                        )}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {genderOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className='grid gap-4 md:grid-cols-2'>
                <div className='space-y-2'>
                  <Label>
                    {t('admin.products.addPage.fields.category.label')}
                  </Label>
                  <Select
                    value={shoe.categoryId}
                    onValueChange={handleSelectChange('categoryId')}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue
                        placeholder={t(
                          'admin.products.addPage.fields.category.placeholder'
                        )}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-2'>
                  <Label>
                    {t('admin.products.addPage.fields.status.label')}
                  </Label>
                  <Select
                    value={shoe.status}
                    onValueChange={handleSelectChange('status')}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue
                        placeholder={t(
                          'admin.products.addPage.fields.status.placeholder'
                        )}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className='grid gap-4 md:grid-cols-2'>
                <div className='space-y-2'>
                  <Label htmlFor='basePrice'>
                    {t('admin.products.addPage.fields.basePrice.label')}
                  </Label>
                  <Input
                    id='basePrice'
                    type='number'
                    min={0}
                    value={shoe.basePrice}
                    onChange={handleChange('basePrice')}
                    placeholder={t(
                      'admin.products.addPage.fields.basePrice.placeholder'
                    )}
                  />
                </div>

                <div className='space-y-2'>
                  <Label>
                    {t('admin.products.addPage.fields.totalStock.label')}
                  </Label>
                  <Input value={totalStock} readOnly />
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='material'>
                  {t('admin.products.addPage.fields.material.label')}
                </Label>
                <Input
                  id='material'
                  value={shoe.material}
                  onChange={handleChange('material')}
                  placeholder={t(
                    'admin.products.addPage.fields.material.placeholder'
                  )}
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='description'>
                  {t('admin.products.addPage.fields.description.label')}
                </Label>
                <Textarea
                  id='description'
                  value={shoe.description}
                  onChange={handleChange('description')}
                  placeholder={t(
                    'admin.products.addPage.fields.description.placeholder'
                  )}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {t('admin.products.addPage.sections.images')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <input
                ref={mainImageInputRef}
                type='file'
                accept='image/*'
                multiple
                className='hidden'
                onChange={handleMainImageChange}
              />

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleShoeImagesDragEnd}
              >
                <SortableContext
                  items={shoeImageOrder.map((item) => item.id)}
                  strategy={rectSortingStrategy}
                >
                  <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
                    {shoeImageOrder.map((item, index) => {
                      const isPrimary = index === 0;
                      const isExisting = item.type === 'existing';
                      const imageSrc = item.value;

                      return (
                        <SortableImageItem key={item.id} id={item.id}>
                          <div
                            className={`group relative aspect-square overflow-hidden rounded-lg border ${
                              isExisting ? 'border-primary' : 'border-border'
                            } bg-muted`}
                          >
                            <img
                              src={imageSrc}
                              alt={isExisting ? 'Shoe existing' : 'Shoe new'}
                              className='h-full w-full object-cover'
                            />

                            {isPrimary && (
                              <span className='absolute left-1 top-1 rounded bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground'>
                                Ảnh chính
                              </span>
                            )}

                            <button
                              type='button'
                              onClick={() =>
                                isExisting
                                  ? removeExistingShoeImage(imageSrc)
                                  : removeNewShoeImage(imageSrc)
                              }
                              className='absolute right-1 top-1 z-20 flex h-6 w-6 items-center justify-center rounded bg-destructive text-white'
                            >
                              <IconX size={14} />
                            </button>
                          </div>
                        </SortableImageItem>
                      );
                    })}

                    <button
                      type='button'
                      onClick={handleChooseMainImage}
                      className='flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-muted/40 transition-colors hover:bg-muted/60'
                    >
                      <IconPlus className='h-6 w-6 text-muted-foreground' />
                      <span className='text-xs font-medium text-muted-foreground'>
                        {t(
                          'admin.products.addPage.images.addButton',
                          'Thêm ảnh'
                        )}
                      </span>
                    </button>
                  </div>
                </SortableContext>
              </DndContext>

              <div className='mt-2 text-xs text-muted-foreground'>
                {t(
                  'admin.products.addPage.imageDropzone.hint',
                  'Chọn nhiều ảnh, kéo thả để tải lên'
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between'>
              <div>
                <CardTitle>
                  {t('admin.products.addPage.sections.variants')}
                </CardTitle>
                <p className='mt-1 text-xs text-muted-foreground'>
                  {t('admin.products.addPage.variants.subtitle')}
                </p>
              </div>
              <Button type='button' size='sm' onClick={handleAddVariant}>
                {t(
                  'admin.products.addPage.variants.addButton',
                  'Thêm biến thể'
                )}
              </Button>
            </CardHeader>
            <CardContent className='space-y-6'>
              {variants.map((variant, index) => (
                <div
                  key={variant.id}
                  className='rounded-lg border bg-card p-4 shadow-sm'
                >
                  <div className='mb-3 flex items-center justify-between'>
                    <p className='text-sm font-semibold'>
                      {t('admin.products.addPage.variants.itemTitle', {
                        index: index + 1,
                      })}
                    </p>
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      className='text-destructive hover:text-destructive'
                      onClick={() => handleRemoveVariantAt(index)}
                      disabled={variants.length === 1}
                    >
                      <IconTrash className='mr-2 h-4 w-4' />
                      {t('common.delete')}
                    </Button>
                  </div>

                  <div className='grid gap-4 md:grid-cols-2'>
                    <div className='space-y-2'>
                      <Label htmlFor={`size-${variant.id}`}>
                        {t('admin.products.addPage.variants.fields.size.label')}
                      </Label>
                      <Input
                        id={`size-${variant.id}`}
                        value={variant.size}
                        onChange={handleVariantChange(variant.id, 'size')}
                        placeholder={t(
                          'admin.products.addPage.variants.fields.size.placeholder'
                        )}
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor={`color-${variant.id}`}>
                        {t(
                          'admin.products.addPage.variants.fields.color.label'
                        )}
                      </Label>
                      <Input
                        id={`color-${variant.id}`}
                        value={variant.color}
                        onChange={handleVariantChange(variant.id, 'color')}
                        placeholder={t(
                          'admin.products.addPage.variants.fields.color.placeholder'
                        )}
                      />
                    </div>
                  </div>

                  <div className='grid gap-4 md:grid-cols-2 mt-4'>
                    <div className='space-y-2'>
                      <Label htmlFor={`stock-${variant.id}`}>
                        {t(
                          'admin.products.addPage.variants.fields.stock.label'
                        )}
                      </Label>
                      <Input
                        id={`stock-${variant.id}`}
                        type='number'
                        min={0}
                        value={variant.stockQuantity}
                        onChange={handleVariantChange(
                          variant.id,
                          'stockQuantity'
                        )}
                        placeholder={t(
                          'admin.products.addPage.variants.fields.stock.placeholder'
                        )}
                      />
                    </div>
                  </div>

                  <div className='mt-4 space-y-2'>
                    <Label>
                      {t('admin.products.addPage.variants.image.label')}
                    </Label>

                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleVariantImagesDragEnd(variant.id)}
                    >
                      <SortableContext
                        items={variant.imageOrder.map((item) => item.id)}
                        strategy={rectSortingStrategy}
                      >
                        <div className='grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6'>
                          {variant.imageOrder.map((item, imageIndex) => {
                            const isPrimary = imageIndex === 0;
                            const isExisting = item.type === 'existing';
                            const imageSrc = item.value;

                            return (
                              <SortableImageItem key={item.id} id={item.id}>
                                <div
                                  className={`group relative aspect-square overflow-hidden rounded-md border ${
                                    isExisting
                                      ? 'border-primary'
                                      : 'border-border'
                                  } bg-muted`}
                                >
                                  <img
                                    src={imageSrc}
                                    alt={`Variant ${index} ${
                                      isExisting ? 'existing' : 'new'
                                    }`}
                                    className='h-full w-full object-cover'
                                  />

                                  {isPrimary && (
                                    <span className='absolute left-0.5 top-0.5 rounded bg-primary px-1 py-0.5 text-[10px] font-semibold text-primary-foreground'>
                                      Ảnh chính
                                    </span>
                                  )}

                                  <button
                                    type='button'
                                    onClick={() =>
                                      isExisting
                                        ? removeVariantExistingImage(
                                            variant.id,
                                            imageSrc
                                          )
                                        : removeVariantNewImageByUrl(
                                            variant.id,
                                            imageSrc
                                          )
                                    }
                                    className='absolute right-0.5 top-0.5 z-20 flex h-5 w-5 items-center justify-center rounded bg-destructive text-white'
                                  >
                                    <IconX size={12} />
                                  </button>
                                </div>
                              </SortableImageItem>
                            );
                          })}

                          <label className='flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed bg-muted/40 transition-colors hover:bg-muted/60'>
                            <IconPlus className='h-4 w-4 text-muted-foreground' />
                            <span className='text-[10px] font-medium text-muted-foreground'>
                              {t(
                                'admin.products.addPage.variants.image.addButton',
                                'Ảnh'
                              )}
                            </span>
                            <input
                              type='file'
                              accept='image/*'
                              multiple
                              className='hidden'
                              onChange={(e) =>
                                handleVariantImageChange(variant.id, e)
                              }
                            />
                          </label>
                        </div>
                      </SortableContext>
                    </DndContext>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </form>

      <div className='sticky bottom-0 z-40 border-t bg-background/90 px-0 py-3 backdrop-blur'>
        <div className='flex items-center justify-end gap-2'>
          <Button variant='outline' onClick={handleCancel}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {t('common.save')}
          </Button>
        </div>
      </div>
    </div>
  );
}
