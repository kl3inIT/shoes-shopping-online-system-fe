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
  CategoryTable,
  CategoryStatsCards,
  CategoryFormDialog,
  type Category,
} from '@/features/admin/categories';

import { mockCategories, parentCategoryOptions } from './data';

export default function AdminCategoriesPage() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState(mockCategories);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [isCreating, setIsCreating] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    imageUrl: '',
    parentCategoryId: '',
  });

  // Filter categories
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: categories.length,
    root: categories.filter((c) => !c.parentCategory).length,
    totalProducts: categories.reduce((sum, c) => sum + c.productCount, 0),
  };

  const handleCreate = () => {
    setIsCreating(true);
    setFormData({
      name: '',
      slug: '',
      description: '',
      imageUrl: '',
      parentCategoryId: '',
    });
    setEditDialogOpen(true);
  };

  const handleEdit = (category: Category) => {
    setIsCreating(false);
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description,
      imageUrl: category.imageUrl,
      parentCategoryId: category.parentCategory?.id || '',
    });
    setEditDialogOpen(true);
  };

  const handleDelete = (category: Category) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedCategory) {
      setCategories((prev) => prev.filter((c) => c.id !== selectedCategory.id));
      setDeleteDialogOpen(false);
      setSelectedCategory(null);
    }
  };

  const handleSave = () => {
    const parentCategory = formData.parentCategoryId
      ? categories.find((c) => c.id === formData.parentCategoryId)
      : null;

    if (isCreating) {
      const newCategory: Category = {
        id: String(Date.now()),
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        imageUrl: formData.imageUrl,
        parentCategory: parentCategory
          ? { id: parentCategory.id, name: parentCategory.name }
          : null,
        productCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setCategories((prev) => [...prev, newCategory]);
    } else if (selectedCategory) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === selectedCategory.id
            ? {
                ...c,
                name: formData.name,
                slug: formData.slug,
                description: formData.description,
                imageUrl: formData.imageUrl,
                parentCategory: parentCategory
                  ? { id: parentCategory.id, name: parentCategory.name }
                  : null,
                updatedAt: new Date().toISOString(),
              }
            : c
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
          <h1 className='text-2xl font-bold'>{t('admin.categories.title')}</h1>
          <p className='text-muted-foreground'>
            {t('admin.categories.subtitle', {
              count: filteredCategories.length,
            })}
          </p>
        </div>
        <Button onClick={handleCreate}>
          <IconPlus className='mr-2 h-4 w-4' />
          {t('admin.categories.addCategory')}
        </Button>
      </div>

      {/* Stats */}
      <div className='px-4 lg:px-6'>
        <CategoryStatsCards {...stats} />
      </div>

      {/* Search */}
      <div className='flex items-center gap-4 px-4 lg:px-6'>
        <div className='relative flex-1 max-w-sm'>
          <IconSearch className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
          <Input
            placeholder={t('admin.categories.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pl-10'
          />
        </div>
      </div>

      {/* Table */}
      <div className='px-4 lg:px-6'>
        <CategoryTable
          categories={filteredCategories}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Edit/Create Dialog */}
      <CategoryFormDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        isCreating={isCreating}
        formData={formData}
        onFormChange={setFormData}
        onSave={handleSave}
        parentOptions={parentCategoryOptions}
      />

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t('admin.categories.deleteDialog.title')}
            </DialogTitle>
            <DialogDescription>
              {t('admin.categories.deleteDialog.description', {
                name: selectedCategory?.name,
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
