import { useTranslation } from 'react-i18next';

import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

import type { Customer, UserStatus } from './CustomerTable';

interface CustomerDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer | null;
}

export function CustomerDetailDialog({
  open,
  onOpenChange,
  customer,
}: CustomerDetailDialogProps) {
  const { t } = useTranslation();

  const getStatusBadge = (status: UserStatus) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <Badge className='bg-green-500'>
            {t('admin.customers.status.active')}
          </Badge>
        );
      case 'INACTIVE':
        return (
          <Badge variant='secondary'>
            {t('admin.customers.status.inactive')}
          </Badge>
        );
      case 'BANNED':
        return (
          <Badge variant='destructive'>
            {t('admin.customers.status.banned')}
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!customer) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-lg'>
        <DialogHeader>
          <DialogTitle>{t('admin.customers.detail.title')}</DialogTitle>
        </DialogHeader>
        <div className='space-y-6'>
          {/* Avatar and Name */}
          <div className='flex items-center gap-4'>
            <Avatar className='h-16 w-16'>
              <AvatarImage src={customer.user.avatarUrl} />
              <AvatarFallback className='text-lg'>
                {customer.user.firstName[0]}
                {customer.user.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className='text-lg font-semibold'>
                {customer.user.lastName} {customer.user.firstName}
              </h3>
              <p className='text-muted-foreground'>@{customer.user.username}</p>
              {getStatusBadge(customer.user.status)}
            </div>
          </div>

          <Separator />

          {/* Contact Info */}
          <div className='grid grid-cols-2 gap-4 text-sm'>
            <div>
              <span className='text-muted-foreground'>
                {t('admin.customers.detail.email')}
              </span>
              <p className='font-medium'>{customer.user.email}</p>
            </div>
            <div>
              <span className='text-muted-foreground'>
                {t('admin.customers.detail.phone')}
              </span>
              <p className='font-medium'>{customer.user.phoneNumber}</p>
            </div>
            <div>
              <span className='text-muted-foreground'>
                {t('admin.customers.detail.dob')}
              </span>
              <p className='font-medium'>
                {formatDate(customer.user.dateOfBirth)}
              </p>
            </div>
            <div>
              <span className='text-muted-foreground'>
                {t('admin.customers.detail.joined')}
              </span>
              <p className='font-medium'>
                {formatDate(customer.user.createdAt)}
              </p>
            </div>
          </div>

          <Separator />

          {/* Stats */}
          <div className='grid grid-cols-3 gap-4 text-center'>
            <div className='rounded-lg bg-muted p-3'>
              <p className='text-2xl font-bold'>{customer.totalOrders}</p>
              <p className='text-xs text-muted-foreground'>
                {t('admin.customers.detail.totalOrders')}
              </p>
            </div>
            <div className='rounded-lg bg-muted p-3'>
              <p className='text-2xl font-bold'>${customer.totalSpent}</p>
              <p className='text-xs text-muted-foreground'>
                {t('admin.customers.detail.totalSpent')}
              </p>
            </div>
            <div className='rounded-lg bg-muted p-3'>
              <p className='text-2xl font-bold'>{customer.reviewCount}</p>
              <p className='text-xs text-muted-foreground'>
                {t('admin.customers.detail.reviews')}
              </p>
            </div>
          </div>

          <Separator />

          {/* Default Address */}
          <div>
            <span className='text-muted-foreground'>
              {t('admin.customers.detail.defaultAddress')}
            </span>
            <p className='font-medium'>{customer.defaultShippingAddress}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
