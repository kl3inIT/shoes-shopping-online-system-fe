import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

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
      <div className='flex items-center justify-between'>
        <div>
          <p className='text-sm font-medium text-muted-foreground'>
            SSOS Admin / Products
          </p>
          <h1 className='mt-1 text-2xl font-bold'>
            {t('admin.products.addProduct', 'Tạo sản phẩm')}
          </h1>
          <p className='text-sm text-muted-foreground'>
            {t(
              'admin.products.addProductSubtitle',
              'Thêm giày mới với nhiều biến thể kích cỡ, màu sắc và tồn kho.'
            )}
          </p>
        </div>
        <div className='flex gap-2'>
          <Button variant='outline' onClick={handleCancel}>
            {t('common.cancel', 'Hủy')}
          </Button>
          <Button onClick={handleSubmit}>{t('common.save', 'Lưu')}</Button>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className='grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]'
      >
        <div className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>
                {t('admin.products.generalInfo', 'Thông tin chung')}
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='name'>{t('admin.products.name', 'Tên')}</Label>
                <Input
                  id='name'
                  value={shoe.name}
                  onChange={handleChange('name')}
                  placeholder='Ví dụ: SSOS Runner Pro'
                />
              </div>

              <div className='grid gap-4 md:grid-cols-2'>
                <div className='space-y-2'>
                  <Label>Brand</Label>
                  <Select
                    value={shoe.brandId}
                    onValueChange={handleSelectChange('brandId')}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Chọn thương hiệu' />
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
                  <Label>Gender</Label>
                  <Select
                    value={shoe.gender}
                    onValueChange={handleSelectChange('gender')}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Chọn giới tính' />
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
                  <Label>Category</Label>
                  <Select
                    value={shoe.categoryId}
                    onValueChange={handleSelectChange('categoryId')}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Chọn danh mục' />
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
                  <Label>Status</Label>
                  <Select
                    value={shoe.status}
                    onValueChange={handleSelectChange('status')}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Chọn trạng thái' />
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
                    {t('admin.products.basePrice', 'Giá gốc')}
                  </Label>
                  <Input
                    id='basePrice'
                    type='number'
                    min={0}
                    value={shoe.basePrice}
                    onChange={handleChange('basePrice')}
                    placeholder='0'
                  />
                </div>

                <div className='space-y-2'>
                  <Label>Tổng tồn kho</Label>
                  <Input value={totalStock} readOnly />
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='material'>
                  {t('admin.products.material', 'Chất liệu')}
                </Label>
                <Input
                  id='material'
                  value={shoe.material}
                  onChange={handleChange('material')}
                  placeholder='Ví dụ: Mesh, da tổng hợp...'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='description'>
                  {t('admin.products.description', 'Mô tả')}
                </Label>
                <Textarea
                  id='description'
                  value={shoe.description}
                  onChange={handleChange('description')}
                  placeholder='Mô tả chi tiết về sản phẩm, công nghệ, trải nghiệm sử dụng...'
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {t('admin.products.images', 'Ảnh sản phẩm')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-muted/40 px-6 py-10 text-center'>
                <p className='text-sm font-medium'>
                  Kéo thả ảnh vào đây hoặc bấm để chọn file
                </p>
                <p className='text-xs text-muted-foreground'>
                  Hỗ trợ PNG, JPG, WEBP. Kích thước đề xuất 1200x1200px.
                </p>
                <Button variant='outline' size='sm'>
                  Chọn ảnh
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='space-y-4'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between'>
              <div>
                <CardTitle>
                  {t('admin.products.variants', 'Variants')}
                </CardTitle>
                <p className='mt-1 text-xs text-muted-foreground'>
                  Thêm các biến thể theo size, màu sắc, SKU và tồn kho.
                </p>
              </div>
              <Button size='sm' type='button' onClick={handleAddVariant}>
                + Thêm variant
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
                      Variant #{index + 1}
                    </p>
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      className='text-destructive'
                      onClick={() => handleRemoveVariant(variant.id)}
                      disabled={variants.length === 1}
                    >
                      Xóa
                    </Button>
                  </div>

                  <div className='grid gap-4 md:grid-cols-2'>
                    <div className='space-y-2'>
                      <Label htmlFor={`size-${variant.id}`}>Size</Label>
                      <Input
                        id={`size-${variant.id}`}
                        value={variant.size}
                        onChange={handleVariantChange(variant.id, 'size')}
                        placeholder='Ví dụ: 40'
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor={`color-${variant.id}`}>Color</Label>
                      <Input
                        id={`color-${variant.id}`}
                        value={variant.color}
                        onChange={handleVariantChange(variant.id, 'color')}
                        placeholder='Ví dụ: Black/White'
                      />
                    </div>
                  </div>

                  <div className='grid gap-4 md:grid-cols-2 mt-4'>
                    <div className='space-y-2'>
                      <Label htmlFor={`price-${variant.id}`}>Price</Label>
                      <Input
                        id={`price-${variant.id}`}
                        type='number'
                        min={0}
                        value={variant.price}
                        onChange={handleVariantChange(variant.id, 'price')}
                        placeholder='0'
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor={`stock-${variant.id}`}>Stock</Label>
                      <Input
                        id={`stock-${variant.id}`}
                        type='number'
                        min={0}
                        value={variant.stockQuantity}
                        onChange={handleVariantChange(
                          variant.id,
                          'stockQuantity'
                        )}
                        placeholder='0'
                      />
                    </div>
                  </div>

                  <div className='mt-4 space-y-2'>
                    <Label>Ảnh variant</Label>
                    <div className='flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-muted/40 px-4 py-6 text-center'>
                      <p className='text-xs font-medium'>
                        Kéo thả ảnh vào đây hoặc bấm để chọn file
                      </p>
                      <p className='text-[11px] text-muted-foreground'>
                        Tối ưu khi nền trắng và hình chụp rõ sản phẩm.
                      </p>
                      <Button variant='outline' size='sm'>
                        Chọn ảnh
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </form>
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
