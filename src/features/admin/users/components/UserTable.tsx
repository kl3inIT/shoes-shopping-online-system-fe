import { useTranslation } from 'react-i18next';
import {
  IconDots,
  IconEye,
  IconShieldCheck,
  IconBan,
  IconCheck,
  IconTrash,
} from '@tabler/icons-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { AdminUser } from '../types';

interface UserTableProps {
  users: AdminUser[];
  onViewDetails: (user: AdminUser) => void;
  onChangeRole: (user: AdminUser) => void;
  onToggleStatus: (user: AdminUser) => void;
  onDelete: (user: AdminUser) => void;
}

function getRoleBadgeVariant(role: AdminUser['role']) {
  switch (role) {
    case 'ROLE_ADMIN':
      return 'destructive';
    case 'ROLE_MANAGER':
      return 'default';
    default:
      return 'secondary';
  }
}

function getStatusBadgeClass(status: AdminUser['status']) {
  switch (status) {
    case 'ACTIVE':
      return 'bg-green-500 text-white hover:bg-green-600';
    case 'INACTIVE':
      return 'bg-red-500 text-white hover:bg-red-600';
    default:
      return '';
  }
}

function getInitials(user: AdminUser) {
  return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
}

export function UserTable({
  users,
  onViewDetails,
  onChangeRole,
  onToggleStatus,
  onDelete,
}: UserTableProps) {
  const { t } = useTranslation();

  return (
    <div className='rounded-lg border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('admin.users.table.user')}</TableHead>
            <TableHead>{t('admin.users.table.email')}</TableHead>
            <TableHead>{t('admin.users.table.role')}</TableHead>
            <TableHead>{t('admin.users.table.status')}</TableHead>
            <TableHead>{t('admin.users.table.joined')}</TableHead>
            <TableHead className='text-right'>
              {t('admin.users.table.actions')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className='py-12 text-center text-muted-foreground'
              >
                {t('common.noData', 'No users found')}
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className='flex items-center gap-3'>
                    <Avatar className='h-9 w-9'>
                      <AvatarImage src={user.avatarUrl ?? undefined} />
                      <AvatarFallback>{getInitials(user)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className='font-medium'>
                        {user.firstName} {user.lastName}
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        @{user.username}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className='text-sm text-muted-foreground'>
                  {user.email}
                </TableCell>
                <TableCell>
                  <Badge variant={getRoleBadgeVariant(user.role)}>
                    {t(`admin.users.role.${user.role}`)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={getStatusBadgeClass(user.status)}
                    variant='secondary'
                  >
                    {t(`admin.users.status.${user.status}`)}
                  </Badge>
                </TableCell>
                <TableCell className='text-sm text-muted-foreground'>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className='text-right'>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' size='icon' className='h-8 w-8'>
                        <IconDots className='h-4 w-4' />
                        <span className='sr-only'>
                          {t('admin.users.table.actions')}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem onClick={() => onViewDetails(user)}>
                        <IconEye className='mr-2 h-4 w-4' />
                        {t('admin.users.actions.viewDetails')}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onChangeRole(user)}>
                        <IconShieldCheck className='mr-2 h-4 w-4' />
                        {t('admin.users.actions.changeRole')}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {user.status === 'ACTIVE' ? (
                        <DropdownMenuItem
                          onClick={() => onToggleStatus(user)}
                          className='text-destructive focus:text-destructive'
                        >
                          <IconBan className='mr-2 h-4 w-4' />
                          {t('admin.users.actions.deactivate')}
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => onToggleStatus(user)}>
                          <IconCheck className='mr-2 h-4 w-4' />
                          {t('admin.users.actions.activate')}
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDelete(user)}
                        className='text-destructive focus:text-destructive'
                      >
                        <IconTrash className='mr-2 h-4 w-4' />
                        {t('admin.users.actions.delete')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
