import { useEffect, useMemo, useRef, useState } from 'react';
import { Camera, Calendar, Mail, Phone, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useMeQuery, useUpdateMyProfileMutation } from '@/features/user/hooks';
import { uploadFileToStorage } from '@/features/storage/api';
import { cn } from '@/lib/utils';

function formatDateLabel(dateString: string | null) {
  if (!dateString) return null;
  try {
    return new Date(dateString).toLocaleString('vi-VN');
  } catch {
    return dateString;
  }
}

function getInitials(username: string) {
  const trimmed = (username ?? '').trim();
  if (!trimmed) return 'U';
  return trimmed.slice(0, 2).toUpperCase();
}

type FormState = {
  phoneNumber: string;
  dateOfBirth: string; // YYYY-MM-DD
  address: string;
  avatarUrl: string;
};

export default function ProfilePage() {
  const { data: user } = useMeQuery();
  const { t } = useTranslation();
  const updateMutation = useUpdateMyProfileMutation();
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const initialForm: FormState = useMemo(
    () => ({
      phoneNumber: user.phoneNumber ?? '',
      dateOfBirth: user.dateOfBirth ?? '',
      address: user.address ?? '',
      avatarUrl: user.avatarUrl ?? '',
    }),
    [user]
  );

  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});

  useEffect(() => {
    setForm(initialForm);
    setErrors({});
    setMode('view');
  }, [initialForm]);

  const isDirty =
    form.phoneNumber !== initialForm.phoneNumber ||
    form.dateOfBirth !== initialForm.dateOfBirth ||
    form.address !== initialForm.address ||
    form.avatarUrl !== initialForm.avatarUrl;

  const validate = () => {
    const next: Partial<Record<keyof FormState, string>> = {};

    if (form.phoneNumber && !/^[0-9+\-\s()]{8,20}$/.test(form.phoneNumber)) {
      next.phoneNumber = t(
        'profile.validation.phone',
        'Số điện thoại không hợp lệ'
      );
    }

    if (form.dateOfBirth) {
      const d = new Date(form.dateOfBirth);
      if (Number.isNaN(d.getTime())) {
        next.dateOfBirth = t(
          'profile.validation.dateOfBirth',
          'Ngày sinh không hợp lệ'
        );
      } else if (d > new Date()) {
        next.dateOfBirth = t(
          'profile.validation.dateOfBirthFuture',
          'Ngày sinh không thể ở tương lai'
        );
      }
    }

    if (form.address && form.address.trim().length < 5) {
      next.address = t('profile.validation.address', 'Địa chỉ quá ngắn');
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onCancel = () => {
    setForm(initialForm);
    setErrors({});
    setMode('view');
  };

  const onSave = async () => {
    if (!validate()) return;
    if (!isDirty) return;

    try {
      await updateMutation.mutateAsync({
        phoneNumber: form.phoneNumber.trim() || null,
        dateOfBirth: form.dateOfBirth || null,
        avatarUrl: form.avatarUrl.trim() || null,
        address: form.address.trim() || null,
      });
      toast.success(t('profile.update.success', 'Cập nhật hồ sơ thành công'));
      setMode('view');
    } catch (e) {
      toast.error(
        e instanceof Error
          ? e.message
          : t('profile.update.error', 'Cập nhật hồ sơ thất bại')
      );
    }
  };

  const onPickAvatar = () => fileInputRef.current?.click();

  const onAvatarSelected = async (file: File | null) => {
    if (!file) return;
    setIsUploading(true);
    try {
      // Put under stable prefix
      const safeName = file.name.replaceAll(' ', '-');
      const objectKey = `avatars/${user.keycloakId}/${Date.now()}-${safeName}`;
      const url = await uploadFileToStorage(file, objectKey);
      setForm((prev) => ({ ...prev, avatarUrl: url }));
      toast.success(t('profile.avatar.uploaded', 'Đã tải ảnh lên'));
    } catch (e) {
      toast.error(
        e instanceof Error
          ? e.message
          : t('profile.avatar.uploadError', 'Tải ảnh lên thất bại')
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className='mx-auto max-w-4xl px-4 py-8'>
      <div className='mb-6 flex items-center justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>
            {t('profile.title', 'Tài khoản của tôi')}
          </h1>
          <p className='mt-2 text-sm text-muted-foreground'>
            {t(
              'profile.subtitle',
              'Quản lý thông tin cá nhân và địa chỉ giao hàng.'
            )}
          </p>
        </div>

        {mode === 'view' ? (
          <Button onClick={() => setMode('edit')}>
            {t('profile.actions.edit', 'Chỉnh sửa')}
          </Button>
        ) : (
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              onClick={onCancel}
              disabled={updateMutation.isPending || isUploading}
            >
              {t('profile.actions.cancel', 'Hủy')}
            </Button>
            <Button
              onClick={onSave}
              disabled={updateMutation.isPending || isUploading || !isDirty}
            >
              {updateMutation.isPending
                ? t('profile.actions.saving', 'Đang lưu...')
                : t('profile.actions.save', 'Lưu')}
            </Button>
          </div>
        )}
      </div>

      <div className='grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]'>
        {/* Main: editable card */}
        <Card className='shadow-sm'>
          <CardHeader className='flex flex-row items-start justify-between gap-4'>
            <div>
              <CardTitle>{t('profile.section.profile', 'Hồ sơ')}</CardTitle>
              <CardDescription>
                {t(
                  'profile.section.profileDesc',
                  'Thông tin dùng để liên hệ và giao hàng.'
                )}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className='space-y-6'>
            {/* Header */}
            <div className='flex items-center gap-4'>
              <div className='relative'>
                <Avatar className='h-16 w-16 border'>
                  <AvatarImage src={form.avatarUrl || undefined} />
                  <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
                </Avatar>

                {mode === 'edit' && (
                  <button
                    type='button'
                    className={cn(
                      'absolute -bottom-1 -right-1 inline-flex h-8 w-8 items-center justify-center rounded-full border bg-background shadow-sm',
                      (isUploading || updateMutation.isPending) &&
                        'opacity-60 pointer-events-none'
                    )}
                    onClick={onPickAvatar}
                    aria-label={t('profile.avatar.change', 'Đổi ảnh')}
                  >
                    <Camera className='h-4 w-4' />
                  </button>
                )}

                <input
                  ref={fileInputRef}
                  type='file'
                  accept='image/*'
                  className='hidden'
                  onChange={(e) =>
                    onAvatarSelected(e.target.files?.[0] ?? null)
                  }
                />
              </div>

              <div className='min-w-0'>
                <p className='text-lg font-semibold leading-tight truncate'>
                  {user.username}
                </p>
                <p className='text-sm text-muted-foreground truncate'>
                  {user.email}
                </p>
                <p className='mt-1 text-xs text-muted-foreground'>
                  {t('profile.lastSeen', 'Hoạt động gần đây')}:{' '}
                  {formatDateLabel(user.lastSeenAt) ??
                    t('profile.common.notProvided', 'Not provided')}
                </p>
              </div>
            </div>

            {/* Form */}
            <div className='grid gap-5 md:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='username'>
                  {t('profile.fields.username', 'Tên người dùng')}
                </Label>
                <div className='relative'>
                  <User className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                  <Input
                    id='username'
                    value={user.username}
                    readOnly
                    className='pl-9'
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='email'>
                  {t('profile.fields.email', 'Email')}
                </Label>
                <div className='relative'>
                  <Mail className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                  <Input
                    id='email'
                    value={user.email}
                    readOnly
                    className='pl-9'
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='phone'>
                  {t('profile.fields.phone', 'Số điện thoại')}
                </Label>
                <div className='relative'>
                  <Phone className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                  <Input
                    id='phone'
                    value={
                      mode === 'edit'
                        ? form.phoneNumber
                        : (user.phoneNumber ?? '')
                    }
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        phoneNumber: e.target.value,
                      }))
                    }
                    readOnly={mode !== 'edit'}
                    className={cn(
                      'pl-9',
                      errors.phoneNumber && 'border-destructive'
                    )}
                    placeholder={t(
                      'profile.common.notProvided',
                      'Not provided'
                    )}
                  />
                </div>
                {errors.phoneNumber && (
                  <p className='text-xs text-destructive'>
                    {errors.phoneNumber}
                  </p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='dob'>
                  {t('profile.fields.dateOfBirth', 'Ngày sinh')}
                </Label>
                <div className='relative'>
                  <Calendar className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                  <Input
                    id='dob'
                    type='date'
                    value={
                      mode === 'edit'
                        ? form.dateOfBirth
                        : (user.dateOfBirth ?? '')
                    }
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        dateOfBirth: e.target.value,
                      }))
                    }
                    readOnly={mode !== 'edit'}
                    className={cn(
                      'pl-9',
                      errors.dateOfBirth && 'border-destructive'
                    )}
                    placeholder={t(
                      'profile.common.notProvided',
                      'Not provided'
                    )}
                  />
                </div>
                {errors.dateOfBirth && (
                  <p className='text-xs text-destructive'>
                    {errors.dateOfBirth}
                  </p>
                )}
              </div>

              <div className='space-y-2 md:col-span-2'>
                <Label htmlFor='address'>
                  {t('profile.fields.address', 'Địa chỉ')}
                </Label>
                <Textarea
                  id='address'
                  value={mode === 'edit' ? form.address : (user.address ?? '')}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, address: e.target.value }))
                  }
                  readOnly={mode !== 'edit'}
                  className={cn(errors.address && 'border-destructive')}
                  placeholder={t('profile.common.notProvided', 'Not provided')}
                />
                {errors.address && (
                  <p className='text-xs text-destructive'>{errors.address}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar: quick view card */}
        <Card className='shadow-sm'>
          <CardHeader>
            <CardTitle className='text-base'>
              {t('profile.section.summary', 'Tóm tắt')}
            </CardTitle>
            <CardDescription>
              {t('profile.section.summaryDesc', 'Thông tin chính')}
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-3 text-sm'>
            <div className='flex items-center justify-between gap-2'>
              <span className='text-muted-foreground'>
                {t('profile.fields.phone', 'Số điện thoại')}
              </span>
              <span className='font-medium truncate'>
                {user.phoneNumber ||
                  t('profile.common.notProvided', 'Not provided')}
              </span>
            </div>
            <div className='flex items-center justify-between gap-2'>
              <span className='text-muted-foreground'>
                {t('profile.fields.dateOfBirth', 'Ngày sinh')}
              </span>
              <span className='font-medium truncate'>
                {user.dateOfBirth ||
                  t('profile.common.notProvided', 'Not provided')}
              </span>
            </div>
            <div className='pt-2 border-t'>
              <p className='text-muted-foreground'>
                {t('profile.fields.address', 'Địa chỉ')}
              </p>
              <p className='mt-1 font-medium whitespace-pre-line'>
                {user.address ||
                  t('profile.common.notProvided', 'Not provided')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
