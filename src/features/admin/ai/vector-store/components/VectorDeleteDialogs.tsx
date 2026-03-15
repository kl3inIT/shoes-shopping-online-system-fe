import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface DeleteSelectedDialogProps {
  open: boolean;
  count: number;
  isPending: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteSelectedDialog({
  open,
  count,
  isPending,
  onConfirm,
  onCancel,
}: DeleteSelectedDialogProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t('admin.ai.vector.deleteSelected.title', 'Delete selected')}
          </DialogTitle>
          <DialogDescription>
            {t(
              'admin.ai.vector.deleteSelected.description',
              `Are you sure you want to delete {{count}} selected document(s)? This action cannot be undone.`,
              { count }
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='outline' onClick={onCancel} disabled={isPending}>
            {t('common.cancel', 'Cancel')}
          </Button>
          <Button
            variant='destructive'
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending
              ? t('common.deleting', 'Deleting...')
              : t('common.delete', 'Delete')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface DeleteByFilterDialogProps {
  open: boolean;
  filter: string;
  isPending: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteByFilterDialog({
  open,
  filter,
  isPending,
  onConfirm,
  onCancel,
}: DeleteByFilterDialogProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t('admin.ai.vector.deleteByFilter.title', 'Delete by filter')}
          </DialogTitle>
          <DialogDescription>
            {t(
              'admin.ai.vector.deleteByFilter.description',
              `Are you sure you want to delete all documents matching filter "{{filter}}"? This action cannot be undone.`,
              { filter }
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='outline' onClick={onCancel} disabled={isPending}>
            {t('common.cancel', 'Cancel')}
          </Button>
          <Button
            variant='destructive'
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending
              ? t('common.deleting', 'Deleting...')
              : t('common.delete', 'Delete')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
