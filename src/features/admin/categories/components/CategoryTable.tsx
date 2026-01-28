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
              {t('admin.categories.table.image')}
            </TableHead>
            <TableHead>{t('admin.categories.table.name')}</TableHead>
            <TableHead>{t('admin.categories.table.parent')}</TableHead>
            <TableHead className='text-center'>
              {t('admin.categories.table.products')}
            </TableHead>
            <TableHead>{t('admin.categories.table.updated')}</TableHead>
            <TableHead className='text-right'>
              {t('admin.categories.table.actions')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  className='h-10 w-10 rounded-md object-cover'
                />
              </TableCell>
              <TableCell>
                <div className='flex items-center gap-2'>
                  {category.parentCategory && (
                    <span className='text-muted-foreground'>└</span>
                  )}
                  <div>
                    <p className='font-medium'>{category.name}</p>
                    <p className='text-xs text-muted-foreground'>
                      {category.slug}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {category.parentCategory ? (
                  <Badge variant='outline'>
                    {category.parentCategory.name}
                  </Badge>
                ) : (
                  <span className='text-muted-foreground'>—</span>
                )}
              </TableCell>
              <TableCell className='text-center'>
                {category.productCount}
              </TableCell>
              <TableCell className='text-sm text-muted-foreground'>
                {formatDate(category.updatedAt)}
              </TableCell>
              <TableCell className='text-right'>
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
