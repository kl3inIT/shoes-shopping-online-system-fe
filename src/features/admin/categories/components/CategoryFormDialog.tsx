import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
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

interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  parentCategoryId: string;
}

interface ParentOption {
  value: string;
  label: string;
}

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isCreating: boolean;
  formData: CategoryFormData;
  onFormChange: (data: CategoryFormData) => void;
  onSave: () => void;
  parentOptions: ParentOption[];
}

export function CategoryFormDialog({
  open,
  onOpenChange,
  isCreating,
  formData,
  onFormChange,
  onSave,
  parentOptions,
}: CategoryFormDialogProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isCreating
              ? t('admin.categories.createDialog.title')
              : t('admin.categories.editDialog.title')}
          </DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <div className='space-y-2'>
            <Label>{t('admin.categories.form.name')}</Label>
            <Input
              value={formData.name}
              onChange={(e) =>
                onFormChange({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div className='space-y-2'>
            <Label>{t('admin.categories.form.slug')}</Label>
            <Input
              value={formData.slug}
              onChange={(e) =>
                onFormChange({ ...formData, slug: e.target.value })
              }
            />
          </div>
          <div className='space-y-2'>
            <Label>{t('admin.categories.form.parent')}</Label>
            <Select
              value={formData.parentCategoryId || 'none'}
              onValueChange={(value) =>
                onFormChange({
                  ...formData,
                  parentCategoryId: value === 'none' ? '' : value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={t('admin.categories.form.selectParent')}
                />
              </SelectTrigger>
              <SelectContent>
                {parentOptions.map((option) => (
                  <SelectItem
                    key={option.value || 'none'}
                    value={option.value || 'none'}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='space-y-2'>
            <Label>{t('admin.categories.form.imageUrl')}</Label>
            <Input
              value={formData.imageUrl}
              onChange={(e) =>
                onFormChange({ ...formData, imageUrl: e.target.value })
              }
            />
          </div>
          <div className='space-y-2'>
            <Label>{t('admin.categories.form.description')}</Label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                onFormChange({ ...formData, description: e.target.value })
              }
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            {t('common.cancel')}
          </Button>
          <Button onClick={onSave}>{t('common.save')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
