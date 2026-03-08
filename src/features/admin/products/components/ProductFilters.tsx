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

interface FilterOption {
  value: string;
  label: string;
}

interface ProductFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  brandFilter: string;
  onBrandChange: (value: string) => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  statusOptions: FilterOption[];
  brandOptions: FilterOption[];
  categoryOptions: FilterOption[];
}

export function ProductFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  brandFilter,
  onBrandChange,
  categoryFilter,
  onCategoryChange,
  statusOptions,
  brandOptions,
  categoryOptions,
}: ProductFiltersProps) {
  const { t } = useTranslation();

  return (
    <div className='flex flex-wrap items-center gap-4'>
      <div className='relative min-w-[200px] flex-1'>
        <IconSearch className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
        <Input
          placeholder={t('admin.products.searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className='pl-10'
        />
      </div>

      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className='w-[150px]'>
          <SelectValue placeholder={t('admin.products.filterStatus')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>{t('admin.products.allStatuses')}</SelectItem>
          {statusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={brandFilter} onValueChange={onBrandChange}>
        <SelectTrigger className='w-[150px]'>
          <SelectValue placeholder={t('admin.products.filterBrand')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>{t('admin.products.allBrands')}</SelectItem>
          {brandOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={categoryFilter} onValueChange={onCategoryChange}>
        <SelectTrigger className='w-[180px]'>
          <SelectValue
            placeholder={t('admin.products.filterCategory', 'Category')}
          />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>
            {t('admin.products.allCategories', 'All Categories')}
          </SelectItem>
          {categoryOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
