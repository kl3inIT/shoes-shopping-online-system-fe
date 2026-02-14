import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconSearch } from '@tabler/icons-react';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  CustomerTable,
  CustomerStatsCards,
  CustomerDetailDialog,
  type Customer,
  type UserStatus,
} from '@/features/admin/customers';

import { mockCustomers, statusOptions } from './data';

export default function AdminCustomersPage() {
  const { t } = useTranslation();
  const [customers, setCustomers] = useState(mockCustomers);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );

  // Filter customers
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.user.username
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      customer.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${customer.user.firstName} ${customer.user.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || customer.user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: customers.length,
    active: customers.filter((c) => c.user.status === 'ACTIVE').length,
    inactive: customers.filter((c) => c.user.status === 'INACTIVE').length,
    banned: customers.filter((c) => c.user.status === 'BANNED').length,
  };

  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setDetailDialogOpen(true);
  };

  const handleSendEmail = (customer: Customer) => {
    console.log('Send email to:', customer.user.email);
  };

  const handleUpdateStatus = (customerId: string, newStatus: UserStatus) => {
    setCustomers((prev) =>
      prev.map((customer) =>
        customer.id === customerId
          ? { ...customer, user: { ...customer.user, status: newStatus } }
          : customer
      )
    );
  };

  return (
    <div className='flex flex-col gap-4 py-4'>
      {/* Header */}
      <div className='flex items-center justify-between px-4 lg:px-6'>
        <div>
          <h1 className='text-2xl font-bold'>{t('admin.customers.title')}</h1>
          <p className='text-muted-foreground'>
            {t('admin.customers.subtitle', { count: filteredCustomers.length })}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='px-4 lg:px-6'>
        <CustomerStatsCards {...stats} />
      </div>

      {/* Filters */}
      <div className='flex flex-wrap items-center gap-4 px-4 lg:px-6'>
        <div className='relative flex-1 min-w-[200px]'>
          <IconSearch className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
          <Input
            placeholder={t('admin.customers.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pl-10'
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className='w-[150px]'>
            <SelectValue placeholder={t('admin.customers.filterStatus')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>
              {t('admin.customers.allStatuses')}
            </SelectItem>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className='px-4 lg:px-6'>
        <CustomerTable
          customers={filteredCustomers}
          onViewDetails={handleViewDetails}
          onSendEmail={handleSendEmail}
          onUpdateStatus={handleUpdateStatus}
        />
      </div>

      {/* Customer Detail Dialog */}
      <CustomerDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        customer={selectedCustomer}
      />
    </div>
  );
}
