import { useTranslation } from 'react-i18next';
import {
  IconEye,
  IconDots,
  IconBan,
  IconCheck,
  IconMail,
} from '@tabler/icons-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BANNED';

export interface Customer {
  id: string;
  user: {
    id: string;
    keycloakId: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    dateOfBirth: string;
    avatarUrl: string;
    role: string;
    status: UserStatus;
    lastSeenAt: string;
    createdAt: string;
  };
  defaultShippingName: string;
  defaultShippingPhone: string;
  defaultShippingAddress: string;
  totalOrders: number;
  totalSpent: number;
  reviewCount: number;
}

interface CustomerTableProps {
  customers: Customer[];
  onViewDetails?: (customer: Customer) => void;
  onSendEmail?: (customer: Customer) => void;
  onUpdateStatus?: (customerId: string, status: UserStatus) => void;
}

export function CustomerTable({
  customers,
  onViewDetails,
  onSendEmail,
  onUpdateStatus,
}: CustomerTableProps) {
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

  return (
    <div className='rounded-lg border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('admin.customers.table.customer')}</TableHead>
            <TableHead>{t('admin.customers.table.email')}</TableHead>
            <TableHead>{t('admin.customers.table.phone')}</TableHead>
            <TableHead className='text-center'>
              {t('admin.customers.table.orders')}
            </TableHead>
            <TableHead className='text-right'>
              {t('admin.customers.table.spent')}
            </TableHead>
            <TableHead>{t('admin.customers.table.status')}</TableHead>
            <TableHead className='text-right'>
              {t('admin.customers.table.actions')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>
                <div className='flex items-center gap-3'>
                  <Avatar>
                    <AvatarImage src={customer.user.avatarUrl} />
                    <AvatarFallback>
                      {customer.user.firstName[0]}
                      {customer.user.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className='font-medium'>
                      {customer.user.lastName} {customer.user.firstName}
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      @{customer.user.username}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{customer.user.email}</TableCell>
              <TableCell>{customer.user.phoneNumber}</TableCell>
              <TableCell className='text-center'>
                {customer.totalOrders}
              </TableCell>
              <TableCell className='text-right'>
                ${customer.totalSpent}
              </TableCell>
              <TableCell>{getStatusBadge(customer.user.status)}</TableCell>
              <TableCell className='text-right'>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='ghost' size='icon'>
                      <IconDots className='h-4 w-4' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem onClick={() => onViewDetails?.(customer)}>
                      <IconEye className='mr-2 h-4 w-4' />
                      {t('admin.customers.actions.viewDetails')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onSendEmail?.(customer)}>
                      <IconMail className='mr-2 h-4 w-4' />
                      {t('admin.customers.actions.sendEmail')}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {customer.user.status === 'BANNED' ? (
                      <DropdownMenuItem
                        onClick={() => onUpdateStatus?.(customer.id, 'ACTIVE')}
                      >
                        <IconCheck className='mr-2 h-4 w-4' />
                        {t('admin.customers.actions.unban')}
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        className='text-destructive'
                        onClick={() => onUpdateStatus?.(customer.id, 'BANNED')}
                      >
                        <IconBan className='mr-2 h-4 w-4' />
                        {t('admin.customers.actions.ban')}
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
