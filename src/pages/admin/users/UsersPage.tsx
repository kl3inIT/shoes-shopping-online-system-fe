import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

import { getErrorMessage } from '@/features/apiClient';
import {
  UserStatsCards,
  UserTable,
  UserDetailDialog,
  UserFormDialog,
  UserRoleDialog,
  useQueryAdminUsers,
  useQueryAdminUserStats,
  useCreateAdminUserMutation,
  useUpdateUserRoleMutation,
  useUpdateUserStatusMutation,
  useToggleUserStatusMutation,
  useDeleteAdminUserMutation,
  type AdminUser,
  type UserRole,
  type UserStatus,
  type CreateAdminUserPayload,
} from '@/features/admin/users';

export default function UsersPage() {
  const { t } = useTranslation();

  const [page, setPage] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | ''>('');
  const [statusFilter, setStatusFilter] = useState<UserStatus | ''>('');

  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const queryParams = {
    page,
    size: 20,
    search: search || undefined,
    role: roleFilter || undefined,
    status: statusFilter || undefined,
  };

  const { data, isPending, isError, error } = useQueryAdminUsers(queryParams);
  const { data: statsData } = useQueryAdminUserStats();
  const createMutation = useCreateAdminUserMutation();
  const updateRoleMutation = useUpdateUserRoleMutation();
  const updateStatusMutation = useUpdateUserStatusMutation();
  const toggleStatusMutation = useToggleUserStatusMutation();
  const deleteMutation = useDeleteAdminUserMutation();

  const users = data?.content ?? [];
  const totalPages = data?.totalPages ?? 1;
  const totalElements = data?.totalElements ?? 0;

  const stats = {
    total: statsData?.total ?? 0,
    admins: statsData?.admins ?? 0,
    managers: statsData?.managers ?? 0,
    customers: statsData?.customers ?? 0,
  };

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(0);
  };

  const handleRoleFilterChange = (value: string) => {
    setRoleFilter(value === 'ALL' ? '' : (value as UserRole));
    setPage(0);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value === 'ALL' ? '' : (value as UserStatus));
    setPage(0);
  };

  const handleViewDetails = (user: AdminUser) => {
    setSelectedUser(user);
    setDetailOpen(true);
  };

  const handleChangeRole = (user: AdminUser) => {
    setSelectedUser(user);
    setRoleDialogOpen(true);
  };

  const handleToggleStatus = (user: AdminUser) => {
    setSelectedUser(user);
    setStatusDialogOpen(true);
  };

  const handleDelete = (user: AdminUser) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleCreateUser = (payload: CreateAdminUserPayload) => {
    createMutation.mutate(payload, {
      onSuccess: () => {
        setCreateOpen(false);
        toast.success(t('admin.users.toast.created'));
      },
      onError: (err) => toast.error(getErrorMessage(err)),
    });
  };

  const handleSaveRole = (role: UserRole) => {
    if (!selectedUser) return;
    updateRoleMutation.mutate(
      { keycloakId: selectedUser.keycloakId, role },
      {
        onSuccess: () => {
          setRoleDialogOpen(false);
          toast.success(t('admin.users.toast.roleUpdated'));
        },
        onError: (err) => toast.error(getErrorMessage(err)),
      }
    );
  };

  const handleConfirmStatusChange = () => {
    if (!selectedUser) return;
    toggleStatusMutation.mutate(selectedUser.keycloakId, {
      onSuccess: () => {
        setStatusDialogOpen(false);
        toast.success(t('admin.users.toast.statusUpdated'));
      },
      onError: (err) => toast.error(getErrorMessage(err)),
    });
  };

  const handleConfirmDelete = () => {
    if (!selectedUser) return;
    deleteMutation.mutate(selectedUser.keycloakId, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        setSelectedUser(null);
        toast.success(t('admin.users.toast.deleted'));
      },
      onError: (err) => {
        setDeleteDialogOpen(false);
        toast.error(getErrorMessage(err));
      },
    });
  };

  if (isPending) {
    return (
      <div className='flex justify-center py-16'>
        <div className='h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent' />
      </div>
    );
  }

  if (isError) {
    return (
      <div className='px-4 py-16 text-center'>
        <p className='text-destructive'>
          {error instanceof Error ? error.message : t('common.loadError')}
        </p>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-4 py-4'>
      {/* Header */}
      <div className='flex items-center justify-between px-4 lg:px-6'>
        <div>
          <h1 className='text-2xl font-bold'>{t('admin.users.title')}</h1>
          <p className='text-muted-foreground'>
            {t('admin.users.subtitle', { count: totalElements })}
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <IconPlus className='mr-2 h-4 w-4' />
          {t('admin.users.addUser')}
        </Button>
      </div>

      {/* Stats */}
      <div className='px-4 lg:px-6'>
        <UserStatsCards {...stats} />
      </div>

      {/* Filters */}
      <div className='flex flex-wrap items-center gap-3 px-4 lg:px-6'>
        <div className='relative flex-1 min-w-[200px] max-w-sm'>
          <IconSearch className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
          <Input
            placeholder={t('admin.users.searchPlaceholder')}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className='pl-10'
          />
        </div>
        <Select
          value={roleFilter || 'ALL'}
          onValueChange={handleRoleFilterChange}
        >
          <SelectTrigger className='w-40'>
            <SelectValue placeholder={t('admin.users.filterRole')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='ALL'>{t('admin.users.allRoles')}</SelectItem>
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
        <Select
          value={statusFilter || 'ALL'}
          onValueChange={handleStatusFilterChange}
        >
          <SelectTrigger className='w-40'>
            <SelectValue placeholder={t('admin.users.filterStatus')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='ALL'>{t('admin.users.allStatuses')}</SelectItem>
            <SelectItem value='ACTIVE'>
              {t('admin.users.status.ACTIVE')}
            </SelectItem>
            <SelectItem value='INACTIVE'>
              {t('admin.users.status.INACTIVE')}
            </SelectItem>
            <SelectItem value='SUSPENDED'>
              {t('admin.users.status.SUSPENDED')}
            </SelectItem>
          </SelectContent>
        </Select>
        {searchInput && (
          <Button variant='outline' onClick={handleSearch} size='sm'>
            {t('common.search', 'Search')}
          </Button>
        )}
      </div>

      {/* Table */}
      <div className='px-4 lg:px-6'>
        <UserTable
          users={users}
          onViewDetails={handleViewDetails}
          onChangeRole={handleChangeRole}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDelete}
        />
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className='px-4 lg:px-6'>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  className={
                    page === 0
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                />
              </PaginationItem>
              <PaginationItem>
                <span className='px-4 py-2 text-sm text-muted-foreground'>
                  {t('common.pageOf', { current: page + 1, total: totalPages })}
                </span>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setPage((p) => Math.min(totalPages - 1, p + 1))
                  }
                  className={
                    page >= totalPages - 1
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Create Dialog */}
      <UserFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSave={handleCreateUser}
        isPending={createMutation.isPending}
      />

      {/* Role Dialog */}
      <UserRoleDialog
        open={roleDialogOpen}
        onOpenChange={setRoleDialogOpen}
        user={selectedUser}
        onSave={handleSaveRole}
        isPending={updateRoleMutation.isPending}
      />

      {/* Status Confirm Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent className='max-w-sm'>
          <DialogHeader>
            <DialogTitle>
              {selectedUser?.status === 'ACTIVE'
                ? t('admin.users.suspendDialog.title')
                : t('admin.users.activateDialog.title')}
            </DialogTitle>
            <DialogDescription>
              {selectedUser?.status === 'ACTIVE'
                ? t('admin.users.suspendDialog.description', {
                    name: selectedUser
                      ? `${selectedUser.firstName} ${selectedUser.lastName}`
                      : '',
                  })
                : t('admin.users.activateDialog.description', {
                    name: selectedUser
                      ? `${selectedUser.firstName} ${selectedUser.lastName}`
                      : '',
                  })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setStatusDialogOpen(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button
              variant={
                selectedUser?.status === 'ACTIVE' ? 'destructive' : 'default'
              }
              onClick={handleConfirmStatusChange}
              disabled={toggleStatusMutation.isPending}
            >
              {toggleStatusMutation.isPending
                ? t('common.saving', 'Saving...')
                : selectedUser?.status === 'ACTIVE'
                  ? t('admin.users.actions.suspend')
                  : t('admin.users.actions.activate')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) deleteMutation.reset();
        }}
      >
        <DialogContent className='max-w-sm'>
          <DialogHeader>
            <DialogTitle>{t('admin.users.deleteDialog.title')}</DialogTitle>
            <DialogDescription>
              {t('admin.users.deleteDialog.description', {
                name: selectedUser
                  ? `${selectedUser.firstName} ${selectedUser.lastName}`
                  : '',
              })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setDeleteDialogOpen(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button
              variant='destructive'
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending
                ? t('common.deleting')
                : t('common.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <UserDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        user={selectedUser}
      />
    </div>
  );
}
