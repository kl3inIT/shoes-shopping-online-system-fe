import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { CreateAdminUserPayload } from '../types';

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (payload: CreateAdminUserPayload) => void;
  isPending?: boolean;
}

interface FormState {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: 'ROLE_MANAGER' | 'ROLE_ADMIN';
}

interface FormErrors {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
}

const initialForm: FormState = {
  username: '',
  email: '',
  firstName: '',
  lastName: '',
  password: '',
  role: 'ROLE_MANAGER',
};

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.username.trim()) errors.username = 'Required';
  if (!form.email.trim()) errors.email = 'Required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = 'Invalid email';
  if (!form.firstName.trim()) errors.firstName = 'Required';
  if (!form.lastName.trim()) errors.lastName = 'Required';
  if (!form.password.trim()) errors.password = 'Required';
  else if (form.password.length < 8) errors.password = 'Min 8 characters';
  return errors;
}

export function UserFormDialog({
  open,
  onOpenChange,
  onSave,
  isPending,
}: UserFormDialogProps) {
  const { t } = useTranslation();
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = () => {
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSave(form);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setForm(initialForm);
      setErrors({});
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>{t('admin.users.createDialog.title')}</DialogTitle>
          <DialogDescription>
            {t('admin.users.createDialog.description')}
          </DialogDescription>
        </DialogHeader>

        <div className='flex flex-col gap-4'>
          <div className='grid grid-cols-2 gap-3'>
            <div className='flex flex-col gap-1.5'>
              <Label>{t('admin.users.form.firstName')}</Label>
              <Input
                value={form.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                placeholder={t('admin.users.form.firstNamePlaceholder')}
              />
              {errors.firstName && (
                <p className='text-xs text-destructive'>{errors.firstName}</p>
              )}
            </div>
            <div className='flex flex-col gap-1.5'>
              <Label>{t('admin.users.form.lastName')}</Label>
              <Input
                value={form.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                placeholder={t('admin.users.form.lastNamePlaceholder')}
              />
              {errors.lastName && (
                <p className='text-xs text-destructive'>{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className='flex flex-col gap-1.5'>
            <Label>{t('admin.users.form.username')}</Label>
            <Input
              value={form.username}
              onChange={(e) => handleChange('username', e.target.value)}
              placeholder={t('admin.users.form.usernamePlaceholder')}
            />
            {errors.username && (
              <p className='text-xs text-destructive'>{errors.username}</p>
            )}
          </div>

          <div className='flex flex-col gap-1.5'>
            <Label>{t('admin.users.form.email')}</Label>
            <Input
              type='email'
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder={t('admin.users.form.emailPlaceholder')}
            />
            {errors.email && (
              <p className='text-xs text-destructive'>{errors.email}</p>
            )}
          </div>

          <div className='flex flex-col gap-1.5'>
            <Label>{t('admin.users.form.password')}</Label>
            <Input
              type='password'
              value={form.password}
              onChange={(e) => handleChange('password', e.target.value)}
              placeholder={t('admin.users.form.passwordPlaceholder')}
            />
            {errors.password && (
              <p className='text-xs text-destructive'>{errors.password}</p>
            )}
          </div>

          <div className='flex flex-col gap-1.5'>
            <Label>{t('admin.users.form.role')}</Label>
            <Select
              value={form.role}
              onValueChange={(v) => handleChange('role', v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='ROLE_MANAGER'>
                  {t('admin.users.role.ROLE_MANAGER')}
                </SelectItem>
                <SelectItem value='ROLE_ADMIN'>
                  {t('admin.users.role.ROLE_ADMIN')}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => handleOpenChange(false)}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending
              ? t('common.saving', 'Saving...')
              : t('common.create', 'Create')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
