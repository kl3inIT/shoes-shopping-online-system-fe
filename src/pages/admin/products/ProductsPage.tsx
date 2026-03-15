import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { IconInfoCircle, IconPlus } from '@tabler/icons-react';

import {
  PageEmptyState,
  PageErrorState,
  PageLoader,
  PaginationControls,
} from '@/components/app';
import { Button } from '@/components/ui/button';
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
  useAdminShoeStockSummary,
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
import { getErrorMessage } from '@/features/apiClient';
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

const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [10, 20, 50];

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
    reviewCount: shoe.reviewCount ?? 0,
    averageRating: shoe.avgRating ?? 0,
    createdAt: shoe.createdAt,
    updatedAt: shoe.updatedAt,
  };
}

export default function AdminProductsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data: brands = [] } = useQueryBrands();
  const { data: categories = [] } = useCategories();
  const updateShoeMutation = useUpdateShoeMutation();

  const initialCategoryId = searchParams.get('categoryId') ?? 'all';

  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [brandFilter, setBrandFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] =
    useState<string>(initialCategoryId);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<ShoeStatus>('ACTIVE');

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSearchQuery(searchInput.trim());
      setCurrentPage(0);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [searchInput]);

  useEffect(() => {
    const nextCategoryId = searchParams.get('categoryId') ?? 'all';
    setCategoryFilter(nextCategoryId);
    setCurrentPage(0);
  }, [searchParams]);

  const shoesQuery = useAdminShoes({
    page: currentPage,
    size: pageSize,
    sort: 'createdAt,desc',
    search: searchQuery || undefined,
    brandIds: brandFilter !== 'all' ? [brandFilter] : undefined,
    categoryIds: categoryFilter !== 'all' ? [categoryFilter] : undefined,
    statuses: statusFilter !== 'all' ? [statusFilter as ShoeStatus] : undefined,
  });

  const shoesPage = shoesQuery.data;
  const products = useMemo(
    () => (shoesPage?.content ?? []).map(mapShoeToProduct),
    [shoesPage]
  );

  useEffect(() => {
    if (!shoesPage || shoesPage.totalPages === 0) {
      return;
    }

    if (currentPage > shoesPage.totalPages - 1) {
      setCurrentPage(Math.max(0, shoesPage.totalPages - 1));
    }
  }, [currentPage, shoesPage]);

  const brandOptions = useMemo(
    () =>
      brands
        .map((brand) => ({ value: brand.id, label: brand.name }))
        .sort((left, right) => left.label.localeCompare(right.label)),
    [brands]
  );

  const categoryOptions = useMemo(
    () =>
      categories
        .map((category) => ({ value: category.id, label: category.name }))
        .sort((left, right) => left.label.localeCompare(right.label)),
    [categories]
  );

  const getTotalStock = (product: Product) =>
    product.variants.reduce((sum, variant) => sum + variant.stockQuantity, 0);

  const isFiltering =
    searchQuery !== '' ||
    statusFilter !== 'all' ||
    brandFilter !== 'all' ||
    categoryFilter !== 'all';

  const { data: stockSummary } = useAdminShoeStockSummary(10, !isFiltering);

  const stats = {
    total: shoesPage?.totalElements ?? stockSummary?.total ?? products.length,
    active:
      stockSummary?.selling ??
      products.filter((product) => product.status === 'ACTIVE').length,
    outOfStock:
      stockSummary?.outOfStock ??
      products.filter((product) => product.status === 'OUT_OF_STOCK').length,
    lowStock:
      stockSummary?.lowStock ??
      products.filter(
        (product) => getTotalStock(product) > 0 && getTotalStock(product) < 10
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
    variants: shoeDetail.variants.map((variant) => ({
      id: variant.id,
      size: variant.size,
      color: variant.color,
      quantity: variant.quantity,
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

  if (shoesQuery.isPending && !shoesPage) {
    return <PageLoader description='Loading products for management.' />;
  }

  if (shoesQuery.isError && !shoesPage) {
    return (
      <PageErrorState
        description={getErrorMessage(shoesQuery.error)}
        action={
          <Button variant='outline' onClick={() => void shoesQuery.refetch()}>
            {t('common.retry')}
          </Button>
        }
      />
    );
  }

  return (
    <div className='flex flex-col gap-4 py-4'>
      <div className='flex items-center justify-between px-4 lg:px-6'>
        <div>
          <h1 className='text-2xl font-bold'>{t('admin.products.title')}</h1>
          <p className='text-muted-foreground'>
            {t('admin.products.subtitle', {
              count: shoesPage?.totalElements ?? products.length,
            })}
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
          searchQuery={searchInput}
          onSearchChange={(value) => setSearchInput(value)}
          statusFilter={statusFilter}
          onStatusChange={(value) => {
            setStatusFilter(value);
            setCurrentPage(0);
          }}
          brandFilter={brandFilter}
          onBrandChange={(value) => {
            setBrandFilter(value);
            setCurrentPage(0);
          }}
          categoryFilter={categoryFilter}
          onCategoryChange={(value) => {
            setCategoryFilter(value);
            setCurrentPage(0);
          }}
          statusOptions={statusOptions}
          brandOptions={brandOptions}
          categoryOptions={categoryOptions}
        />
      </div>

      <div className='px-4 lg:px-6'>
        {shoesQuery.isError && shoesPage ? (
          <div className='mb-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive'>
            {getErrorMessage(shoesQuery.error)}
          </div>
        ) : null}

        {shoesQuery.isFetching && !shoesQuery.isPending ? (
          <p className='mb-3 text-sm text-muted-foreground'>
            {t('admin.products.loadingResults', 'Updating products...')}
          </p>
        ) : null}

        {products.length === 0 ? (
          <PageEmptyState
            title={t('admin.products.emptyTitle', 'No products found')}
            description={t(
              'admin.products.emptyDescription',
              'Adjust the filters or search term to find more products.'
            )}
          />
        ) : (
          <ProductTable
            products={products}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onChangeStatus={handleChangeStatus}
          />
        )}
      </div>

      {shoesPage && shoesPage.totalPages > 1 ? (
        <div className='px-4 lg:px-6'>
          <PaginationControls
            page={shoesPage.pageNumber ?? shoesPage.number}
            totalPages={shoesPage.totalPages}
            totalElements={shoesPage.totalElements}
            pageSize={shoesPage.size}
            pageSizeOptions={PAGE_SIZE_OPTIONS}
            isFirst={shoesPage.first}
            isLast={shoesPage.last}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(0);
            }}
          />
        </div>
      ) : null}

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
