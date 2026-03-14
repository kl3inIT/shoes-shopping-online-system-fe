import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import type { AdminUser } from '../types';

interface UserDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: AdminUser | null;
}

function getInitials(user: AdminUser) {
  return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
}

export function UserDetailDialog({
  open,
  onOpenChange,
  user,
}: UserDetailDialogProps) {
  const { t } = useTranslation();

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>{t('admin.users.detail.title')}</DialogTitle>
        </DialogHeader>

        <div className='flex flex-col items-center gap-3 py-4'>
          <Avatar className='h-20 w-20'>
            <AvatarImage src={user.avatarUrl ?? undefined} />
            <AvatarFallback className='text-xl'>
              {getInitials(user)}
            </AvatarFallback>
          </Avatar>
          <div className='text-center'>
            <p className='text-lg font-semibold'>
              {user.firstName} {user.lastName}
            </p>
            <p className='text-sm text-muted-foreground'>@{user.username}</p>
          </div>
          <div className='flex gap-2'>
            <Badge
              variant={
                user.role === 'ROLE_ADMIN'
                  ? 'destructive'
                  : user.role === 'ROLE_MANAGER'
                    ? 'default'
                    : 'secondary'
              }
            >
              {t(`admin.users.role.${user.role}`)}
            </Badge>
            <Badge
              className={
                user.status === 'ACTIVE'
                  ? 'bg-green-500 text-white'
                  : user.status === 'INACTIVE'
                    ? 'bg-red-500 text-white'
                    : ''
              }
              variant='secondary'
            >
              {t(`admin.users.status.${user.status}`)}
            </Badge>
          </div>
        </div>

        <Separator />

        <div className='grid grid-cols-2 gap-3 text-sm'>
          <div>
            <p className='text-xs font-medium text-muted-foreground uppercase tracking-wide'>
              {t('admin.users.detail.email')}
            </p>
            <p className='mt-1 break-all'>{user.email}</p>
          </div>
          <div>
            <p className='text-xs font-medium text-muted-foreground uppercase tracking-wide'>
              {t('admin.users.detail.phone')}
            </p>
            <p className='mt-1'>{user.phoneNumber ?? '—'}</p>
          </div>
          <div>
            <p className='text-xs font-medium text-muted-foreground uppercase tracking-wide'>
              {t('admin.users.detail.dob')}
            </p>
            <p className='mt-1'>{user.dateOfBirth ?? '—'}</p>
          </div>
          <div>
            <p className='text-xs font-medium text-muted-foreground uppercase tracking-wide'>
              {t('admin.users.detail.joined')}
            </p>
            <p className='mt-1'>
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className='col-span-2'>
            <p className='text-xs font-medium text-muted-foreground uppercase tracking-wide'>
              {t('admin.users.detail.address')}
            </p>
            <p className='mt-1'>{user.address ?? '—'}</p>
          </div>
          {user.lastSeenAt && (
            <div className='col-span-2'>
              <p className='text-xs font-medium text-muted-foreground uppercase tracking-wide'>
                {t('admin.users.detail.lastSeen')}
              </p>
              <p className='mt-1'>
                {new Date(user.lastSeenAt).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
