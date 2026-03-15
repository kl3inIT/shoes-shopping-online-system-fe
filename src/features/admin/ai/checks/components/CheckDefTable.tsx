import { IconDots, IconPencil, IconTrash } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { CheckDef } from '../types';

interface CheckDefTableProps {
  defs: CheckDef[];
  isLoading: boolean;
  onEdit: (def: CheckDef) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, active: boolean) => void;
}

export function CheckDefTable({
  defs,
  isLoading,
  onEdit,
  onDelete,
  onToggleActive,
}: CheckDefTableProps) {
  const { t } = useTranslation();

  return (
    <div className='overflow-hidden rounded-2xl border border-border/70'>
      <Table className='table-fixed min-w-[840px]'>
        <TableHeader className='bg-muted/30'>
          <TableRow>
            <TableHead className='w-[22%] px-4 py-3'>
              {t('admin.ai.checks.table.defs.category', 'Category')}
            </TableHead>
            <TableHead className='w-[48%] px-4 py-3'>
              {t('admin.ai.checks.table.defs.question', 'Question')}
            </TableHead>
            <TableHead className='w-[15%] px-4 py-3'>
              {t('admin.ai.checks.table.defs.active', 'Active')}
            </TableHead>
            <TableHead className='w-[15%] px-4 py-3 text-right'>
              {t('admin.ai.checks.table.defs.actions', 'Actions')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            ['skeleton-1', 'skeleton-2', 'skeleton-3'].map((key) => (
              <TableRow key={key}>
                <TableCell colSpan={4}>
                  <div className='h-4 animate-pulse rounded bg-muted' />
                </TableCell>
              </TableRow>
            ))
          ) : defs.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className='py-12 text-center text-muted-foreground'
              >
                {t('admin.ai.checks.table.defs.empty', 'No check definitions')}
              </TableCell>
            </TableRow>
          ) : (
            defs.map((def) => (
              <TableRow key={def.id}>
                <TableCell className='px-4 py-4 align-top whitespace-normal text-sm text-muted-foreground'>
                  {def.category ?? 'N/A'}
                </TableCell>
                <TableCell className='px-4 py-4 align-top whitespace-normal'>
                  <p className='line-clamp-3 break-words text-sm leading-6'>
                    {def.question}
                  </p>
                </TableCell>
                <TableCell className='px-4 py-4 align-top'>
                  <div className='flex items-center gap-3'>
                    <Switch
                      checked={def.active}
                      onCheckedChange={(checked: boolean) =>
                        onToggleActive(def.id, checked)
                      }
                    />
                    <span className='text-sm text-muted-foreground'>
                      {def.active
                        ? t('admin.ai.checks.activeState.on', {
                            defaultValue: 'Enabled',
                          })
                        : t('admin.ai.checks.activeState.off', {
                            defaultValue: 'Disabled',
                          })}
                    </span>
                  </div>
                </TableCell>
                <TableCell className='px-4 py-4 align-top text-right'>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' size='icon' className='h-8 w-8'>
                        <IconDots className='h-4 w-4' />
                        <span className='sr-only'>
                          {t(
                            'admin.ai.checks.table.defs.openMenu',
                            'Open menu'
                          )}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem onClick={() => onEdit(def)}>
                        <IconPencil className='mr-2 h-4 w-4' />
                        {t('admin.ai.checks.table.defs.edit', 'Edit')}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className='text-destructive focus:text-destructive'
                        onClick={() => onDelete(def.id)}
                      >
                        <IconTrash className='mr-2 h-4 w-4' />
                        {t('admin.ai.checks.table.defs.delete', 'Delete')}
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
