import { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
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
import { useBrands, useCategories } from '@/features/products';
import { createShoe } from '@/features/admin/products';

interface VariantFormState {
  id: string;
  size: string;
  color: string;
  stockQuantity: string;
  images: File[];
  previewUrls: string[];
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

export default function AddShoePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: brands = [] } = useBrands();
  const { data: categories = [] } = useCategories();

  const [shoe, setShoe] = useState<ShoeFormState>({
    name: '',
    brandId: '',
    categoryId: '',
    gender: 'UNISEX',
    status: 'ACTIVE',
    basePrice: '',
    material: '',
    description: '',
  });

  const [variants, setVariants] = useState<VariantFormState[]>([
    createEmptyVariant(1),
  ]);

  const [shoeImages, setShoeImages] = useState<File[]>([]);
  const [shoePreviewUrls, setShoePreviewUrls] = useState<string[]>([]);
  const mainImageInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      shoePreviewUrls.forEach((url) => URL.revokeObjectURL(url));
      variants.forEach((v) =>
        v.previewUrls.forEach((url) => URL.revokeObjectURL(url))
      );
    };
  }, []);

  const handleChooseMainImage = () => {
    mainImageInputRef.current?.click();
  };

  const handleMainImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setShoeImages((prev) => [...prev, ...files]);
    setShoePreviewUrls((prev) => [...prev, ...newPreviewUrls]);

    if (mainImageInputRef.current) mainImageInputRef.current.value = '';
  };

  const removeShoeImage = (index: number) => {
    URL.revokeObjectURL(shoePreviewUrls[index]);
    setShoeImages((prev) => prev.filter((_, i) => i !== index));
    setShoePreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVariantImageChange = (
    variantId: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));

    setVariants((prev) =>
      prev.map((v) =>
        v.id === variantId
          ? {
              ...v,
              images: [...v.images, ...files],
              previewUrls: [...v.previewUrls, ...newPreviewUrls],
            }
          : v
      )
    );

    event.target.value = '';
  };

  const removeVariantImage = (variantId: string, imageIndex: number) => {
    setVariants((prev) =>
      prev.map((v) => {
        if (v.id === variantId) {
          URL.revokeObjectURL(v.previewUrls[imageIndex]);
          return {
            ...v,
            images: v.images.filter((_, i) => i !== imageIndex),
            previewUrls: v.previewUrls.filter((_, i) => i !== imageIndex),
          };
        }
        return v;
      })
    );
  };

  const handleChange =
    (field: keyof ShoeFormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;

      setShoe((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  const handleSelectChange =
    (field: keyof ShoeFormState) => (value: string) => {
      setShoe((prev) => ({
        ...prev,
        [field]: value,
      }));
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

  const handleAddVariant = () => {
    setVariants((prev) => [...prev, createEmptyVariant(prev.length + 1)]);
  };

  const handleRemoveVariant = (id: string) => {
    setVariants((prev) => {
      const variant = prev.find((v) => v.id === id);
      variant?.previewUrls.forEach((url) => URL.revokeObjectURL(url));
      return prev.length > 1 ? prev.filter((v) => v.id !== id) : prev;
    });
  };

  const totalStock = variants.reduce(
    (sum, v) => sum + (Number(v.stockQuantity) || 0),
    0
  );

  const handleCancel = () => {
    navigate('/admin/products');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (isSubmitting) return;

    if (!shoe.name || !shoe.brandId || !shoe.categoryId || !shoe.basePrice) {
      toast.error('Vui lòng điền đầy đủ các trường bắt buộc');
      return;
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
          size: v.size,
          color: v.color,
          quantity: Number(v.stockQuantity) || 0,
        })),
      };

      const variantImagesArray = variants.map((v) => v.images);

      await createShoe(payload, shoeImages, variantImagesArray);
      toast.success('Tạo sản phẩm thành công!');
      navigate('/admin/products');
    } catch (error) {
      console.error('Failed to create shoe:', error);
      toast.error('Có lỗi xảy ra khi tạo sản phẩm');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='flex flex-col gap-6 px-4 py-4 lg:px-6'>
      <div>
        <p className='text-sm font-medium text-muted-foreground'>
          {t('admin.products.addPage.breadcrumb')}
        </p>
        <h1 className='mt-1 text-2xl font-bold'>
          {t('admin.products.addPage.title')}
        </h1>
        <p className='text-sm text-muted-foreground'>
          {t('admin.products.addPage.subtitle')}
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

              <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 mb-4'>
                {shoePreviewUrls.map((url, index) => (
                  <div
                    key={url}
                    className='group relative aspect-square overflow-hidden rounded-lg border bg-muted'
                  >
                    <img
                      src={url}
                      alt={`Shoe ${index}`}
                      className='h-full w-full object-cover'
                    />
                    <button
                      type='button'
                      onClick={() => removeShoeImage(index)}
                      className='absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-white opacity-0 transition-opacity group-hover:opacity-100'
                    >
                      <IconX size={14} />
                    </button>
                  </div>
                ))}

                <button
                  type='button'
                  onClick={handleChooseMainImage}
                  className='flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-muted/40 transition-colors hover:bg-muted/60'
                >
                  <IconPlus className='h-6 w-6 text-muted-foreground' />
                  <span className='text-xs font-medium text-muted-foreground'>
                    Thêm ảnh
                  </span>
                </button>
              </div>

              <div className='text-center'>
                <p className='text-xs text-muted-foreground'>
                  {t('admin.products.addPage.imageDropzone.hint')}
                </p>
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
              <Button size='sm' type='button' onClick={handleAddVariant}>
                {t('admin.products.addPage.variants.addButton')}
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
                      onClick={() => handleRemoveVariant(variant.id)}
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
                    <div className='grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6'>
                      {variant.previewUrls.map((url, imgIndex) => (
                        <div
                          key={url}
                          className='group relative aspect-square overflow-hidden rounded-md border bg-muted'
                        >
                          <img
                            src={url}
                            alt={`Variant ${index} - ${imgIndex}`}
                            className='h-full w-full object-cover'
                          />
                          <button
                            type='button'
                            onClick={() =>
                              removeVariantImage(variant.id, imgIndex)
                            }
                            className='absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-white opacity-0 transition-opacity group-hover:opacity-100'
                          >
                            <IconX size={12} />
                          </button>
                        </div>
                      ))}

                      <label className='flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed bg-muted/40 transition-colors hover:bg-muted/60'>
                        <IconPlus className='h-4 w-4 text-muted-foreground' />
                        <span className='text-[10px] font-medium text-muted-foreground'>
                          Ảnh
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
          <Button onClick={handleSubmit}>{t('common.save')}</Button>
        </div>
      </div>
    </div>
  );
}

function createEmptyVariant(index: number): VariantFormState {
  return {
    id: `variant-${index}-${Date.now()}`,
    size: '',
    color: '',
    stockQuantity: '',
    images: [],
    previewUrls: [],
  };
}
