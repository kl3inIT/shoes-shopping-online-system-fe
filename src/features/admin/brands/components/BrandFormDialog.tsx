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

interface BrandFormData {
  name: string;
  slug: string;
  description: string;
  country: string;
  logoUrl: string;
}

interface CountryOption {
  value: string;
  label: string;
}

interface BrandFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isCreating: boolean;
  formData: BrandFormData;
  onFormChange: (data: BrandFormData) => void;
  onSave: () => void;
  countryOptions: CountryOption[];
}

export function BrandFormDialog({
  open,
  onOpenChange,
  isCreating,
  formData,
  onFormChange,
  onSave,
  countryOptions,
}: BrandFormDialogProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isCreating
              ? t('admin.brands.createDialog.title')
              : t('admin.brands.editDialog.title')}
          </DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <div className='space-y-2'>
            <Label>{t('admin.brands.form.name')}</Label>
            <Input
              value={formData.name}
              onChange={(e) =>
                onFormChange({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div className='space-y-2'>
            <Label>{t('admin.brands.form.slug')}</Label>
            <Input
              value={formData.slug}
              onChange={(e) =>
                onFormChange({ ...formData, slug: e.target.value })
              }
            />
          </div>
          <div className='space-y-2'>
            <Label>{t('admin.brands.form.country')}</Label>
            <Select
              value={formData.country}
              onValueChange={(value) =>
                onFormChange({ ...formData, country: value })
              }
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={t('admin.brands.form.selectCountry')}
                />
              </SelectTrigger>
              <SelectContent>
                {countryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='space-y-2'>
            <Label>{t('admin.brands.form.logoUrl')}</Label>
            <Input
              value={formData.logoUrl}
              onChange={(e) =>
                onFormChange({ ...formData, logoUrl: e.target.value })
              }
            />
          </div>
          <div className='space-y-2'>
            <Label>{t('admin.brands.form.description')}</Label>
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
