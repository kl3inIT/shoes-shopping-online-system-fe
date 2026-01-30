import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { IconPlus } from '@tabler/icons-react';

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
  ProductTable,
  ProductStatsCards,
  ProductFilters,
  type Product,
} from '@/features/admin/products';

import { mockProducts, brandOptions, statusOptions } from './data';

export default function AdminProductsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [products, setProducts] = useState(mockProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [brandFilter, setBrandFilter] = useState<string>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || product.status === statusFilter;
    const matchesBrand =
      brandFilter === 'all' || product.brand.id === brandFilter;
    return matchesSearch && matchesStatus && matchesBrand;
  });

  const getTotalStock = (product: Product) => {
    return product.variants.reduce((sum, v) => sum + v.stockQuantity, 0);
  };

  const stats = {
    total: products.length,
    active: products.filter((p) => p.status === 'ACTIVE').length,
    outOfStock: products.filter((p) => p.status === 'OUT_OF_STOCK').length,
    lowStock: products.filter(
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

  const confirmDelete = () => {
    if (selectedProduct) {
      setProducts((prev) => prev.filter((p) => p.id !== selectedProduct.id));
      setDeleteDialogOpen(false);
      setSelectedProduct(null);
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
          products={filteredProducts}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

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
