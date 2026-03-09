import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { IconInfoCircle, IconPlus } from '@tabler/icons-react';

import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import {
  ProductTable,
  ProductStatsCards,
  ProductFilters,
  type Product,
} from '@/features/admin/products';
import {
  useAdminShoes,
  useUpdateShoeMutation,
} from '@/features/admin/products';
import {
  getShoeById,
  useCategories,
  type ShoeResponse,
  type ShoeStatus,
  type ShoeUpdateRequestDto,
} from '@/features/products';

import { useQueryBrands } from '@/features/brands';
import { statusOptions } from './data';

const STATUS_VALUES: ShoeStatus[] = [
  'ACTIVE',
  'INACTIVE',
  'OUT_OF_STOCK',
  'DRAFT',
  'DISCONTINUED',
];

const STATUS_LABEL_KEYS: Record<ShoeStatus, string> = {
  ACTIVE: 'admin.products.status.active',
  INACTIVE: 'admin.products.status.inactive',
  OUT_OF_STOCK: 'admin.products.status.outOfStock',
  DRAFT: 'admin.products.status.draft',
  DISCONTINUED: 'admin.products.status.discontinued',
};

function mapShoeToProduct(shoe: ShoeResponse): Product {
  const firstImageUrl = shoe.imageUrls[0] ?? '';

  return {
    id: shoe.id,
    name: shoe.name,
    slug: shoe.slug,
    brand: {
      id: shoe.brandId,
      name: shoe.brandName,
    },
    category: {
      id: shoe.categoryId,
      name: shoe.categoryName,
    },
    gender: shoe.gender,
    material: shoe.material,
    description: shoe.description,
    imageUrl: firstImageUrl,
    shoeImageUrls: shoe.imageUrls,
    basePrice: shoe.price,
    status: shoe.status as Product['status'],
    deleted: false,
    variants: shoe.variants.map((variant): Product['variants'][number] => ({
      id: variant.id,
      sku: variant.sku,
      size: variant.size,
      color: variant.color,
      price: shoe.price,
      stockQuantity: variant.quantity,
      status: variant.quantity === 0 ? 'OUT_OF_STOCK' : 'AVAILABLE',
      imageUrls: variant.imageUrls,
    })),
    reviewCount: 0,
    averageRating: 0,
    createdAt: shoe.createdAt,
    updatedAt: shoe.updatedAt,
  };
}

export default function AdminProductsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: shoes = [] } = useAdminShoes();
  const { data: brands = [] } = useQueryBrands();
  const { data: categories = [] } = useCategories();
  const updateShoeMutation = useUpdateShoeMutation();

  const products = useMemo(() => shoes.map(mapShoeToProduct), [shoes]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [brandFilter, setBrandFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<ShoeStatus>('ACTIVE');

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filteredProducts = useMemo(() => {
    const result = products.filter((product) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        product.name.toLowerCase().includes(q) ||
        product.slug.toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === 'all' || product.status === statusFilter;
      const matchesBrand =
        brandFilter === 'all' || product.brand.id === brandFilter;
      const matchesCategory =
        categoryFilter === 'all' || product.category.id === categoryFilter;

      return matchesSearch && matchesStatus && matchesBrand && matchesCategory;
    });

    return result.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [products, searchQuery, statusFilter, brandFilter, categoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, brandFilter, categoryFilter]);

  useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage]);

  const brandOptions = useMemo(
    () =>
      brands
        .map((b) => ({ value: b.id, label: b.name }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [brands]
  );

  const categoryOptions = useMemo(
    () =>
      categories
        .map((c) => ({ value: c.id, label: c.name }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [categories]
  );

  const getTotalStock = (product: Product) =>
    product.variants.reduce((sum, v) => sum + v.stockQuantity, 0);

  const stats = {
    total: filteredProducts.length,
    active: filteredProducts.filter((p) => p.status === 'ACTIVE').length,
    outOfStock: filteredProducts.filter((p) => p.status === 'OUT_OF_STOCK')
      .length,
    lowStock: filteredProducts.filter(
      (p) => getTotalStock(p) > 0 && getTotalStock(p) < 10
    ).length,
  };

  const handleView = (product: Product) => {
    navigate(`/admin/products/${product.id}`);
  };

  const handleEdit = (product: Product) => {
    navigate(`/admin/products/${product.id}/edit`, {
      state: { from: '/admin/products' },
    });
  };

  const buildUpdatePayloadFromDetail = (
    shoeDetail: ShoeResponse,
    newStatus: ShoeStatus
  ): ShoeUpdateRequestDto => ({
    name: shoeDetail.name,
    description: shoeDetail.description,
    material: shoeDetail.material,
    gender: shoeDetail.gender,
    status: newStatus,
    categoryId: shoeDetail.categoryId,
    brandId: shoeDetail.brandId,
    price: shoeDetail.price,
    variants: shoeDetail.variants.map((v) => ({
      id: v.id,
      size: v.size,
      color: v.color,
      quantity: v.quantity,
    })),
  });

  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  const handleChangeStatus = (product: Product) => {
    setSelectedProduct(product);
    setSelectedStatus(product.status as ShoeStatus);
    setStatusDialogOpen(true);
  };

  const confirmStatusUpdate = async () => {
    if (!selectedProduct) return;

    const shoeDetail = await getShoeById(selectedProduct.id);
    const payload = buildUpdatePayloadFromDetail(shoeDetail, selectedStatus);

    await updateShoeMutation.mutateAsync({
      id: selectedProduct.id,
      payload,
    });

    setStatusDialogOpen(false);
    setSelectedProduct(null);
  };

  const confirmDelete = async () => {
    if (!selectedProduct) return;

    try {
      const shoeDetail = await getShoeById(selectedProduct.id);
      const payload = buildUpdatePayloadFromDetail(shoeDetail, 'INACTIVE');

      await updateShoeMutation.mutateAsync({
        id: selectedProduct.id,
        payload,
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedProduct(null);
    }
  };

  return (
    <div className='flex flex-col gap-4 py-4'>
      <div className='flex items-center justify-between px-4 lg:px-6'>
        <div>
          <h1 className='text-2xl font-bold'>{t('admin.products.title')}</h1>
          <p className='text-muted-foreground'>
            {t('admin.products.subtitle', { count: filteredProducts.length })}
          </p>
        </div>
        <Button onClick={() => navigate('/admin/addshoe')}>
          <IconPlus className='mr-2 h-4 w-4' />
          {t('admin.products.addProduct')}
        </Button>
      </div>

      <div className='px-4 lg:px-6'>
        <ProductStatsCards {...stats} />
      </div>

      <div className='px-4 lg:px-6'>
        <ProductFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          brandFilter={brandFilter}
          onBrandChange={setBrandFilter}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          statusOptions={statusOptions}
          brandOptions={brandOptions}
          categoryOptions={categoryOptions}
        />
      </div>

      <div className='px-4 lg:px-6'>
        <ProductTable
          products={paginatedProducts}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onChangeStatus={handleChangeStatus}
        />
      </div>

      {totalPages > 1 && (
        <div className='mt-4 px-4 lg:px-6'>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className={
                    currentPage === 1
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                />
              </PaginationItem>

              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i + 1}>
                  <PaginationLink
                    onClick={() => setCurrentPage(i + 1)}
                    isActive={currentPage === i + 1}
                    className='cursor-pointer'
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  className={
                    currentPage === totalPages
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('admin.products.statusDialog.title')}</DialogTitle>
            <DialogDescription>
              {t('admin.products.statusDialog.description', {
                name: selectedProduct?.name,
              })}
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-4'>
            <div className='flex items-center gap-2'>
              <p className='text-sm font-medium'>
                {t('admin.products.statusDialog.statusLabel')}
              </p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type='button' className='text-muted-foreground'>
                      <IconInfoCircle className='h-4 w-4' />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className='max-w-xs'>
                    <p>{t('admin.products.statusDialog.tooltip')}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <Select
              value={selectedStatus}
              onValueChange={(value) => setSelectedStatus(value as ShoeStatus)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_VALUES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {t(STATUS_LABEL_KEYS[status])}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className='space-y-1 text-xs text-muted-foreground'>
              <p>• {t('admin.products.statusHelp.active')}</p>
              <p>• {t('admin.products.statusHelp.outOfStock')}</p>
              <p>• {t('admin.products.statusHelp.inactive')}</p>
              <p>• {t('admin.products.statusHelp.draft')}</p>
              <p>• {t('admin.products.statusHelp.discontinued')}</p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setStatusDialogOpen(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button onClick={confirmStatusUpdate}>{t('common.save')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('admin.products.deleteDialog.title')}</DialogTitle>
            <DialogDescription>
              {t('admin.products.deleteDialog.description', {
                name: selectedProduct?.name,
              })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setDeleteDialogOpen(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button variant='destructive' onClick={confirmDelete}>
              {t('common.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
