import { useCallback, useEffect, useState } from 'react';
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

import {
  CategoryTable,
  CategoryStatsCards,
  CategoryFormDialog,
  type Category,
} from '@/features/admin/categories';

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/features/admin/categories/api';
import { getErrorMessage } from '@/features/apiClient';

export default function AdminCategoriesPage() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
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
    description: '',
  });

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch {
      setCategories([]);
      toast.error(t('admin.categories.fetchError', 'Không thể tải danh sách'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

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
      description: '',
    });
    setEditDialogOpen(true);
  };

  const handleEdit = (category: Category) => {
    setIsCreating(false);
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
    });
    setEditDialogOpen(true);
  };

  const handleDelete = (category: Category) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedCategory) return;
    setDeleting(true);
    try {
      await deleteCategory(selectedCategory.id);
      setCategories((prev) => prev.filter((c) => c.id !== selectedCategory.id));
      toast.success(t('admin.categories.deleteSuccess', 'Đã xóa danh mục'));
      setDeleteDialogOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setDeleting(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      toast.error(
        t('admin.categories.fillRequired', 'Vui lòng điền đầy đủ thông tin')
      );
      return;
    }
    setSaving(true);
    try {
      if (isCreating) {
        const created = await createCategory(formData);
        // Update local state to avoid refetch/reload the table
        setCategories((prev) => [created, ...prev]);
        toast.success(t('admin.categories.createSuccess', 'Đã tạo danh mục'));
      } else if (selectedCategory) {
        const updated = await updateCategory(selectedCategory.id, formData);
        setCategories((prev) =>
          prev.map((c) => (c.id === updated.id ? updated : c))
        );
        toast.success(
          t('admin.categories.updateSuccess', 'Đã cập nhật danh mục')
        );
      }
      setEditDialogOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
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
        {loading ? (
          <div className='rounded-lg border p-8 text-center text-muted-foreground'>
            {t('common.loading', 'Đang tải...')}
          </div>
        ) : (
          <CategoryTable
            categories={filteredCategories}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* Edit/Create Dialog */}
      <CategoryFormDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        isCreating={isCreating}
        formData={formData}
        onFormChange={setFormData}
        onSave={handleSave}
        saving={saving}
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
            <Button
              variant='destructive'
              onClick={() => void confirmDelete()}
              disabled={deleting}
            >
              {deleting
                ? t('common.loading', 'Đang xóa...')
                : t('common.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
