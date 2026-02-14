import { useTranslation } from 'react-i18next';
import { IconEdit, IconTrash, IconDots } from '@tabler/icons-react';

import { Button } from '@/components/ui/button';
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

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  parentCategory: { id: string; name: string } | null;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

interface CategoryTableProps {
  categories: Category[];
  onEdit?: (category: Category) => void;
  onDelete?: (category: Category) => void;
}

export function CategoryTable({
  categories,
  onEdit,
  onDelete,
}: CategoryTableProps) {
  const { t, i18n } = useTranslation();

  const formatDate = (dateString: string) => {
    const locale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className='rounded-lg border shadow-sm'>
      <Table>
        <TableHeader>
          <TableRow className='bg-muted/50 hover:bg-muted/50'>
            <TableHead className='font-semibold w-[200px]'>
              {t('admin.categories.table.name')}
            </TableHead>
            <TableHead className='font-semibold min-w-[220px] max-w-[300px]'>
              {t('admin.categories.table.description')}
            </TableHead>
            <TableHead className='font-semibold text-center w-[100px]'>
              {t('admin.categories.table.products')}
            </TableHead>
            <TableHead className='font-semibold w-[120px]'>
              {t('admin.categories.table.createdAt')}
            </TableHead>
            <TableHead className='font-semibold w-[120px]'>
              {t('admin.categories.table.updatedAt')}
            </TableHead>
            <TableHead className='font-semibold text-right w-[80px]'>
              {t('admin.categories.table.actions')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow
              key={category.id}
              className='group transition-colors hover:bg-muted/30'
            >
              <TableCell className='align-top py-4'>
                <p className='font-semibold text-foreground'>{category.name}</p>
              </TableCell>
              <TableCell className='align-top py-4 max-w-[300px]'>
                <p
                  className='text-sm text-muted-foreground line-clamp-2'
                  title={category.description}
                >
                  {category.description || '—'}
                </p>
              </TableCell>
              <TableCell className='align-top py-4 text-center'>
                <span className='inline-flex items-center justify-center min-w-[2rem] px-2 py-0.5 rounded-md bg-primary/10 text-primary font-medium text-sm'>
                  {category.productCount}
                </span>
              </TableCell>
              <TableCell className='align-top py-4 text-sm text-muted-foreground'>
                {formatDate(category.createdAt)}
              </TableCell>
              <TableCell className='align-top py-4 text-sm text-muted-foreground'>
                {formatDate(category.updatedAt)}
              </TableCell>
              <TableCell className='align-top py-4 text-right'>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='ghost' size='icon'>
                      <IconDots className='h-4 w-4' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem onClick={() => onEdit?.(category)}>
                      <IconEdit className='mr-2 h-4 w-4' />
                      {t('admin.categories.actions.edit')}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className='text-destructive'
                      onClick={() => onDelete?.(category)}
                    >
                      <IconTrash className='mr-2 h-4 w-4' />
                      {t('admin.categories.actions.delete')}
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
