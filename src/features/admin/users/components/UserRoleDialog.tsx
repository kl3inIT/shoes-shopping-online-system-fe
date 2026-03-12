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
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { AdminUser, UserRole } from '../types';

interface UserRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: AdminUser | null;
  onSave: (role: UserRole) => void;
  isPending?: boolean;
}

export function UserRoleDialog({
  open,
  onOpenChange,
  user,
  onSave,
  isPending,
}: UserRoleDialogProps) {
  const { t } = useTranslation();
  const [selectedRole, setSelectedRole] = useState<UserRole>(
    user?.role ?? 'ROLE_CUSTOMER'
  );

  const handleOpenChange = (open: boolean) => {
    if (open && user) setSelectedRole(user.role);
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='max-w-sm'>
        <DialogHeader>
          <DialogTitle>{t('admin.users.roleDialog.title')}</DialogTitle>
          <DialogDescription>
            {t('admin.users.roleDialog.description', {
              name: user ? `${user.firstName} ${user.lastName}` : '',
            })}
          </DialogDescription>
        </DialogHeader>

        <div className='flex flex-col gap-1.5 py-2'>
          <Label>{t('admin.users.table.role')}</Label>
          <Select
            value={selectedRole}
            onValueChange={(v) => setSelectedRole(v as UserRole)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='ROLE_ADMIN'>
                {t('admin.users.role.ROLE_ADMIN')}
              </SelectItem>
              <SelectItem value='ROLE_MANAGER'>
                {t('admin.users.role.ROLE_MANAGER')}
              </SelectItem>
              <SelectItem value='ROLE_CUSTOMER'>
                {t('admin.users.role.ROLE_CUSTOMER')}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            {t('common.cancel')}
          </Button>
          <Button
            onClick={() => onSave(selectedRole)}
            disabled={isPending || selectedRole === user?.role}
          >
            {isPending ? t('common.saving', 'Saving...') : t('common.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
