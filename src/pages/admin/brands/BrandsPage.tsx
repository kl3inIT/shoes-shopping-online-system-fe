import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconPlus, IconSearch } from '@tabler/icons-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import {
  BrandTable,
  BrandStatsCards,
  BrandFormDialog,
  type Brand,
} from '@/features/admin/brands';

import { mockBrands, countryOptions } from './data';

export default function AdminBrandsPage() {
  const { t } = useTranslation();
  const [brands, setBrands] = useState(mockBrands);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    country: '',
    logoUrl: '',
  });

  // Filter brands
  const filteredBrands = brands.filter(
    (brand) =>
      brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brand.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: brands.length,
    totalProducts: brands.reduce((sum, b) => sum + b.productCount, 0),
    countries: new Set(brands.map((b) => b.country)).size,
  };

  const handleCreate = () => {
    setIsCreating(true);
    setFormData({
      name: '',
      slug: '',
      description: '',
      country: '',
      logoUrl: '',
    });
    setEditDialogOpen(true);
  };

  const handleEdit = (brand: Brand) => {
    setIsCreating(false);
    setSelectedBrand(brand);
    setFormData({
      name: brand.name,
      slug: brand.slug,
      description: brand.description,
      country: brand.country,
      logoUrl: brand.logoUrl,
    });
    setEditDialogOpen(true);
  };

  const handleDelete = (brand: Brand) => {
    setSelectedBrand(brand);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedBrand) {
      setBrands((prev) => prev.filter((b) => b.id !== selectedBrand.id));
      setDeleteDialogOpen(false);
      setSelectedBrand(null);
    }
  };

  const handleSave = () => {
    if (isCreating) {
      const newBrand: Brand = {
        id: String(Date.now()),
        ...formData,
        productCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setBrands((prev) => [...prev, newBrand]);
    } else if (selectedBrand) {
      setBrands((prev) =>
        prev.map((b) =>
          b.id === selectedBrand.id
            ? { ...b, ...formData, updatedAt: new Date().toISOString() }
            : b
        )
      );
    }
    setEditDialogOpen(false);
  };

  return (
    <div className='flex flex-col gap-4 py-4'>
      {/* Header */}
      <div className='flex items-center justify-between px-4 lg:px-6'>
        <div>
          <h1 className='text-2xl font-bold'>{t('admin.brands.title')}</h1>
          <p className='text-muted-foreground'>
            {t('admin.brands.subtitle', { count: filteredBrands.length })}
          </p>
        </div>
        <Button onClick={handleCreate}>
          <IconPlus className='mr-2 h-4 w-4' />
          {t('admin.brands.addBrand')}
        </Button>
      </div>

      {/* Stats */}
      <div className='px-4 lg:px-6'>
        <BrandStatsCards {...stats} />
      </div>

      {/* Search */}
      <div className='flex items-center gap-4 px-4 lg:px-6'>
        <div className='relative flex-1 max-w-sm'>
          <IconSearch className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
          <Input
            placeholder={t('admin.brands.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pl-10'
          />
        </div>
      </div>

      {/* Table */}
      <div className='px-4 lg:px-6'>
        <BrandTable
          brands={filteredBrands}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Edit/Create Dialog */}
      <BrandFormDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        isCreating={isCreating}
        formData={formData}
        onFormChange={setFormData}
        onSave={handleSave}
        countryOptions={countryOptions}
      />

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('admin.brands.deleteDialog.title')}</DialogTitle>
            <DialogDescription>
              {t('admin.brands.deleteDialog.description', {
                name: selectedBrand?.name,
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
