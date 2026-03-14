import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import { toast } from 'sonner';

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

import { getErrorMessage } from '@/features/apiClient';
import {
  BrandTable,
  BrandStatsCards,
  BrandFormDialog,
  useQueryBrands,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
  type Brand,
} from '@/features/brands';

function mapDtoToBrand(dto: {
  id: string;
  name: string;
  slug: string;
  description: string;
  country: string;
  logoUrl: string;
  createdAt: string;
  updatedAt: string;
  productCount?: number;
}): Brand {
  return {
    id: dto.id,
    name: dto.name,
    slug: dto.slug,
    description: dto.description,
    country: dto.country,
    logoUrl: dto.logoUrl,
    productCount: dto.productCount ?? 0,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}

export default function AdminBrandsPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    country: '',
    logoUrl: '',
  });

  const { data: brandsData, isPending, isError, error } = useQueryBrands();
  const createMutation = useCreateBrandMutation();
  const updateMutation = useUpdateBrandMutation();
  const deleteMutation = useDeleteBrandMutation();

  const brands: Brand[] = (brandsData ?? []).map(mapDtoToBrand);
  const filteredBrands = brands.filter(
    (brand) =>
      brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brand.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: brands.length,
    totalProducts: brands.reduce((sum, b) => sum + (b.productCount ?? 0), 0),
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
      deleteMutation.mutate(selectedBrand.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setSelectedBrand(null);
        },
        onError: (error) => {
          setDeleteDialogOpen(false);
          setSelectedBrand(null);
          toast.error(getErrorMessage(error));
        },
      });
    }
  };

  const handleSave = (data: {
    name: string;
    slug: string;
    description: string;
    country: string;
    logoUrl: string;
  }) => {
    const body = {
      name: data.name,
      slug: data.slug,
      description: data.description,
      country: data.country,
      logoUrl: data.logoUrl,
    };
    if (isCreating) {
      createMutation.mutate(body, {
        onSuccess: () => setEditDialogOpen(false),
        onError: (error) => toast.error(getErrorMessage(error)),
      });
    } else if (selectedBrand) {
      updateMutation.mutate(
        { id: selectedBrand.id, body },
        {
          onSuccess: () => setEditDialogOpen(false),
          onError: (error) => toast.error(getErrorMessage(error)),
        }
      );
    }
  };

  if (isPending) {
    return (
      <div className='flex justify-center py-16'>
        <div className='h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent' />
      </div>
    );
  }

  if (isError) {
    return (
      <div className='px-4 py-16 text-center'>
        <p className='text-destructive'>
          {error instanceof Error ? error.message : t('common.loadError')}
        </p>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-4 py-4'>
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

      <div className='px-4 lg:px-6'>
        <BrandStatsCards {...stats} />
      </div>

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

      <div className='px-4 lg:px-6'>
        <BrandTable
          brands={filteredBrands}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <BrandFormDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        isCreating={isCreating}
        formData={formData}
        onFormChange={setFormData}
        onSave={handleSave}
      />

      <Dialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) deleteMutation.reset();
        }}
      >
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
            <Button
              variant='destructive'
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending
                ? t('common.deleting')
                : t('common.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
