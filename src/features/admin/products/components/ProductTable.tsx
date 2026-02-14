import { useTranslation } from 'react-i18next';
import { IconEdit, IconTrash, IconEye, IconDots } from '@tabler/icons-react';

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

export interface ProductVariant {
  id: string;
  sku: string;
  size: string;
  color: string;
  price: number;
  stockQuantity: number;
  status: 'AVAILABLE' | 'OUT_OF_STOCK' | 'DISCONTINUED';
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: { id: string; name: string };
  category: { id: string; name: string };
  gender: string;
  material: string;
  description: string;
  imageUrl: string;
  basePrice: number;
  status: 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK';
  variants: ProductVariant[];
  reviewCount: number;
  averageRating: number;
  createdAt: string;
  updatedAt: string;
}

interface ProductTableProps {
  products: Product[];
  onView?: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

export function ProductTable({
  products,
  onView,
  onEdit,
  onDelete,
}: ProductTableProps) {
  const { t } = useTranslation();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <Badge className='bg-green-500'>
            {t('admin.products.status.active')}
          </Badge>
        );
      case 'INACTIVE':
        return (
          <Badge variant='secondary'>
            {t('admin.products.status.inactive')}
          </Badge>
        );
      case 'OUT_OF_STOCK':
        return (
          <Badge variant='destructive'>
            {t('admin.products.status.outOfStock')}
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getTotalStock = (product: Product) => {
    return product.variants.reduce((sum, v) => sum + v.stockQuantity, 0);
  };

  return (
    <div className='rounded-lg border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[80px]'>
              {t('admin.products.table.image')}
            </TableHead>
            <TableHead>{t('admin.products.table.name')}</TableHead>
            <TableHead>{t('admin.products.table.brand')}</TableHead>
            <TableHead>{t('admin.products.table.category')}</TableHead>
            <TableHead className='text-right'>
              {t('admin.products.table.price')}
            </TableHead>
            <TableHead className='text-center'>
              {t('admin.products.table.stock')}
            </TableHead>
            <TableHead>{t('admin.products.table.status')}</TableHead>
            <TableHead className='text-right'>
              {t('admin.products.table.actions')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className='h-12 w-12 rounded-md object-cover'
                />
              </TableCell>
              <TableCell>
                <div>
                  <p className='font-medium'>{product.name}</p>
                  <p className='text-xs text-muted-foreground'>
                    {product.slug}
                  </p>
                </div>
              </TableCell>
              <TableCell>{product.brand.name}</TableCell>
              <TableCell>{product.category.name}</TableCell>
              <TableCell className='text-right'>${product.basePrice}</TableCell>
              <TableCell className='text-center'>
                <span
                  className={
                    getTotalStock(product) === 0
                      ? 'text-red-600'
                      : getTotalStock(product) < 10
                        ? 'text-orange-600'
                        : ''
                  }
                >
                  {getTotalStock(product)}
                </span>
              </TableCell>
              <TableCell>{getStatusBadge(product.status)}</TableCell>
              <TableCell className='text-right'>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='ghost' size='icon'>
                      <IconDots className='h-4 w-4' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem onClick={() => onView?.(product)}>
                      <IconEye className='mr-2 h-4 w-4' />
                      {t('admin.products.actions.view')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit?.(product)}>
                      <IconEdit className='mr-2 h-4 w-4' />
                      {t('admin.products.actions.edit')}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className='text-destructive'
                      onClick={() => onDelete?.(product)}
                    >
                      <IconTrash className='mr-2 h-4 w-4' />
                      {t('admin.products.actions.delete')}
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
