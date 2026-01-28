import { useTranslation } from 'react-i18next';
import { IconEdit, IconTrash, IconDots } from '@tabler/icons-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string;
  country: string;
  logoUrl: string;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

interface BrandTableProps {
  brands: Brand[];
  onEdit?: (brand: Brand) => void;
  onDelete?: (brand: Brand) => void;
}

export function BrandTable({ brands, onEdit, onDelete }: BrandTableProps) {
  const { t } = useTranslation();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className='rounded-lg border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[60px]'>
              {t('admin.brands.table.logo')}
            </TableHead>
            <TableHead>{t('admin.brands.table.name')}</TableHead>
            <TableHead>{t('admin.brands.table.country')}</TableHead>
            <TableHead className='text-center'>
              {t('admin.brands.table.products')}
            </TableHead>
            <TableHead>{t('admin.brands.table.updated')}</TableHead>
            <TableHead className='text-right'>
              {t('admin.brands.table.actions')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {brands.map((brand) => (
            <TableRow key={brand.id}>
              <TableCell>
                <div className='flex h-10 w-10 items-center justify-center rounded-md bg-muted p-1'>
                  <img
                    src={brand.logoUrl}
                    alt={brand.name}
                    className='h-full w-full object-contain'
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://via.placeholder.com/40';
                    }}
                  />
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className='font-medium'>{brand.name}</p>
                  <p className='text-xs text-muted-foreground'>{brand.slug}</p>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant='outline'>{brand.country}</Badge>
              </TableCell>
              <TableCell className='text-center'>
                {brand.productCount}
              </TableCell>
              <TableCell className='text-sm text-muted-foreground'>
                {formatDate(brand.updatedAt)}
              </TableCell>
              <TableCell className='text-right'>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='ghost' size='icon'>
                      <IconDots className='h-4 w-4' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem onClick={() => onEdit?.(brand)}>
                      <IconEdit className='mr-2 h-4 w-4' />
                      {t('admin.brands.actions.edit')}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className='text-destructive'
                      onClick={() => onDelete?.(brand)}
                    >
                      <IconTrash className='mr-2 h-4 w-4' />
                      {t('admin.brands.actions.delete')}
                    </DropdownMenuItem>
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
