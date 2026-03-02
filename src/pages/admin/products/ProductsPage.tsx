import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { IconPlus } from '@tabler/icons-react';

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
  ProductTable,
  ProductStatsCards,
  ProductFilters,
  type Product,
} from '@/features/admin/products';
import { useAdminShoesAll, type ShoeResponse } from '@/features/products';
import { deleteShoe } from '@/features/products/api';
import { API_BASE_URL } from '@/features/apiClient';

import { brandOptions, statusOptions } from './data';

function mapShoeToProduct(shoe: ShoeResponse): Product {
  const firstImageKey = shoe.imageUrls[0];
  const firstImageUrl = firstImageKey
    ? `${API_BASE_URL}/api/files/${firstImageKey}`
    : '';

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
    basePrice: shoe.price,
    status: shoe.status as Product['status'],
    deleted: shoe.deleted,
    variants: shoe.variants.map((variant) => ({
      id: variant.id,
      sku: variant.sku,
      size: variant.size,
      color: variant.color,
      price: shoe.price,
      stockQuantity: variant.quantity,
      status: variant.quantity === 0 ? 'OUT_OF_STOCK' : 'AVAILABLE',
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
  const { data: shoes } = useAdminShoesAll();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [brandFilter, setBrandFilter] = useState<string>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    if (!shoes) return;

    const mappedProducts = shoes.map(mapShoeToProduct);
    setProducts(mappedProducts);
  }, [shoes]);

  // Filter & sort products (newest first)
  const filteredProducts = useMemo(() => {
    const result = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.slug.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' || product.status === statusFilter;
      const matchesBrand =
        brandFilter === 'all' || product.brand.id === brandFilter;
      return matchesSearch && matchesStatus && matchesBrand;
    });

    return result.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [products, searchQuery, statusFilter, brandFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  const getTotalStock = (product: Product) => {
    return product.variants.reduce((sum, v) => sum + v.stockQuantity, 0);
  };

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
    console.log('View product:', product.id);
  };

  const handleEdit = (product: Product) => {
    console.log('Edit product:', product.id);
  };

  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedProduct) {
      try {
        await deleteShoe(selectedProduct.id);
        setProducts((prev) => prev.filter((p) => p.id !== selectedProduct.id));
      } finally {
        setDeleteDialogOpen(false);
        setSelectedProduct(null);
      }
    }
  };

  return (
    <div className='flex flex-col gap-4 py-4'>
      {/* Header */}
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

      {/* Stats Cards */}
      <div className='px-4 lg:px-6'>
        <ProductStatsCards {...stats} />
      </div>

      {/* Filters */}
      <div className='px-4 lg:px-6'>
        <ProductFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          brandFilter={brandFilter}
          onBrandChange={setBrandFilter}
          statusOptions={statusOptions}
          brandOptions={brandOptions}
        />
      </div>

      {/* Table */}
      <div className='px-4 lg:px-6'>
        <ProductTable
          products={paginatedProducts}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
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

      {/* Delete Dialog */}
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
