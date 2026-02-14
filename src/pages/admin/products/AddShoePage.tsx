import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { IconTrash } from '@tabler/icons-react';

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
  brandOptions,
  categoryOptions,
  genderOptions,
  statusOptions,
  type Gender,
  type ProductStatus as ShoeStatus,
} from './data';
interface VariantFormState {
  id: string;
  size: string;
  color: string;
  price: string;
  stockQuantity: string;
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

  const [shoe, setShoe] = useState<ShoeFormState>({
    name: '',
    brandId: brandOptions[0]?.value ?? '',
    categoryId: categoryOptions[0]?.value ?? '',
    gender: 'UNISEX',
    status: 'ACTIVE',
    basePrice: '',
    material: '',
    description: '',
  });

  const [variants, setVariants] = useState<VariantFormState[]>([
    createEmptyVariant(1),
  ]);

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
    setVariants((prev) =>
      prev.length > 1 ? prev.filter((v) => v.id !== id) : prev
    );
  };

  const totalStock = variants.reduce(
    (sum, v) => sum + (Number(v.stockQuantity) || 0),
    0
  );

  const handleCancel = () => {
    navigate('/admin/products');
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const payload = {
      shoe: {
        ...shoe,
        quantity: totalStock,
        price: Number(shoe.basePrice) || 0,
      },
      variants: variants.map((v) => ({
        size: v.size,
        color: v.color,
        price: Number(v.price) || 0,
        quantity: Number(v.stockQuantity) || 0,
      })),
    };

    // For now we only log the payload – this is a pure UI screen.
    // Later, this can be wired to the backend create endpoints.
    // eslint-disable-next-line no-console
    console.log('Add shoe payload:', payload);
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
                      {brandOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
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
                      {categoryOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
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
              <div className='flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-muted/40 px-6 py-10 text-center'>
                <p className='text-sm font-medium'>
                  {t('admin.products.addPage.imageDropzone.title')}
                </p>
                <p className='text-xs text-muted-foreground'>
                  {t('admin.products.addPage.imageDropzone.hint')}
                </p>
                <Button variant='outline' size='sm'>
                  {t('admin.products.addPage.imageDropzone.button')}
                </Button>
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
                      <Label htmlFor={`price-${variant.id}`}>
                        {t(
                          'admin.products.addPage.variants.fields.price.label'
                        )}
                      </Label>
                      <Input
                        id={`price-${variant.id}`}
                        type='number'
                        min={0}
                        value={variant.price}
                        onChange={handleVariantChange(variant.id, 'price')}
                        placeholder={t(
                          'admin.products.addPage.variants.fields.price.placeholder'
                        )}
                      />
                    </div>
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
                    <div className='flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-muted/40 px-4 py-6 text-center'>
                      <p className='text-xs font-medium'>
                        {t('admin.products.addPage.variants.image.title')}
                      </p>
                      <p className='text-[11px] text-muted-foreground'>
                        {t('admin.products.addPage.variants.image.hint')}
                      </p>
                      <Button variant='outline' size='sm'>
                        {t('admin.products.addPage.variants.image.button')}
                      </Button>
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
    price: '',
    stockQuantity: '',
  };
}
