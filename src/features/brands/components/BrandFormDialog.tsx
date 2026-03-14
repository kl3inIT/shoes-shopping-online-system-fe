import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { uploadFileToStorage } from '@/features/storage';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface BrandFormData {
  name: string;
  slug: string;
  description: string;
  country: string;
  logoUrl: string;
}

interface BrandFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isCreating: boolean;
  formData: BrandFormData;
  onFormChange: (data: BrandFormData) => void;
  /** Gọi với data đã sẵn sàng (có logoUrl sau khi upload nếu có file chọn). Cancel thì không upload. */
  onSave: (data: BrandFormData) => void;
}

export function BrandFormDialog({
  open,
  onOpenChange,
  isCreating,
  formData,
  onFormChange,
  onSave,
}: BrandFormDialogProps) {
  const { t } = useTranslation();
  const [selectedLogoFile, setSelectedLogoFile] = useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Revoke object URL when cleanup (dialog close or file change)
  useEffect(() => {
    return () => {
      if (logoPreviewUrl) URL.revokeObjectURL(logoPreviewUrl);
    };
  }, [logoPreviewUrl]);

  // Reset pending file when dialog closes
  useEffect(() => {
    if (!open) {
      setSelectedLogoFile(null);
      if (logoPreviewUrl) {
        URL.revokeObjectURL(logoPreviewUrl);
        setLogoPreviewUrl(null);
      }
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps -- only reset when open becomes false

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (logoPreviewUrl) URL.revokeObjectURL(logoPreviewUrl);
    setSelectedLogoFile(file);
    setLogoPreviewUrl(URL.createObjectURL(file));
    // Xóa link/ảnh cũ: khi chọn ảnh mới thì bỏ URL cũ khỏi input, preview sẽ hiển thị ảnh vừa chọn.
    onFormChange({ ...formData, logoUrl: '' });
  };

  const handleDialogOpenChange = (next: boolean) => {
    if (!next) {
      setSelectedLogoFile(null);
      if (logoPreviewUrl) {
        URL.revokeObjectURL(logoPreviewUrl);
        setLogoPreviewUrl(null);
      }
    }
    onOpenChange(next);
  };

  const handleSaveClick = async () => {
    let finalLogoUrl = formData.logoUrl;
    if (selectedLogoFile) {
      setUploading(true);
      try {
        const ext = (
          selectedLogoFile.name.split('.').pop() || 'png'
        ).toLowerCase();
        const objectKey = `brands/${crypto.randomUUID()}.${ext}`;
        finalLogoUrl = await uploadFileToStorage(selectedLogoFile, objectKey);
      } finally {
        setUploading(false);
      }
    }
    onSave({ ...formData, logoUrl: finalLogoUrl });
  };

  const previewUrl = logoPreviewUrl ?? formData.logoUrl;

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isCreating
              ? t('admin.brands.createDialog.title')
              : t('admin.brands.editDialog.title')}
          </DialogTitle>
          <DialogDescription className='sr-only'>
            {isCreating
              ? t(
                  'admin.brands.createDialog.description',
                  'Form to create a new brand'
                )
              : t(
                  'admin.brands.editDialog.description',
                  'Form to edit brand details'
                )}
          </DialogDescription>
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
            <Input
              value={formData.country}
              onChange={(e) =>
                onFormChange({ ...formData, country: e.target.value })
              }
              placeholder={t('admin.brands.form.selectCountry')}
            />
          </div>
          <div className='space-y-2'>
            <Label>{t('admin.brands.form.logoUrl')}</Label>
            <div className='flex flex-wrap items-center gap-2'>
              <Input
                value={formData.logoUrl}
                onChange={(e) =>
                  onFormChange({ ...formData, logoUrl: e.target.value })
                }
                placeholder='https://... or upload file'
                className='flex-1 min-w-0'
              />
              <label className='inline-flex h-9 cursor-pointer items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50'>
                <input
                  type='file'
                  accept='image/*'
                  className='sr-only'
                  onChange={handleFileSelect}
                  disabled={uploading}
                />
                {uploading
                  ? t('common.uploading')
                  : t('admin.brands.form.uploadLogo')}
              </label>
            </div>
            <div className='mt-1 flex items-center gap-2'>
              <div className='relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded border bg-muted'>
                {previewUrl ? (
                  <>
                    <img
                      src={previewUrl}
                      alt='Logo preview'
                      className='h-full w-full object-contain'
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const placeholder = e.currentTarget.nextElementSibling;
                        if (placeholder)
                          (placeholder as HTMLElement).classList.remove(
                            'hidden'
                          );
                      }}
                    />
                    <span
                      className='absolute inset-0 hidden flex items-center justify-center text-xs text-muted-foreground'
                      aria-hidden
                    >
                      {t('admin.brands.form.noImage', 'No image')}
                    </span>
                  </>
                ) : (
                  <span className='text-xs text-muted-foreground'>
                    {t('admin.brands.form.noImage', 'No image')}
                  </span>
                )}
              </div>
              {selectedLogoFile && (
                <span className='text-xs text-muted-foreground'>
                  {t(
                    'admin.brands.form.logoPreviewHint',
                    'Preview – upload when you Save'
                  )}
                </span>
              )}
            </div>
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
          <Button
            variant='outline'
            onClick={() => handleDialogOpenChange(false)}
          >
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSaveClick} disabled={uploading}>
            {uploading ? t('common.uploading') : t('common.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
