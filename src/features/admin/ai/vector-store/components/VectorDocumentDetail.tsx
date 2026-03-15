import { useTranslation } from 'react-i18next';
import { IconLoader2 } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useQueryVectorDocument } from '../hooks';
import type { VectorDocument } from '../types';

interface VectorDocumentDetailProps {
  doc: VectorDocument | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VectorDocumentDetail({
  doc,
  open,
  onOpenChange,
}: VectorDocumentDetailProps) {
  const { t } = useTranslation();
  const { data, isLoading } = useQueryVectorDocument(doc?.id ?? '');

  if (!doc) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>
            {t('admin.ai.vector.detail.title', 'Document detail')}
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-4'>
          <div>
            <p className='mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground'>
              {t('admin.ai.vector.detail.id', 'ID')}
            </p>
            <p className='break-all font-mono text-xs'>{doc.id}</p>
          </div>

          <div>
            <p className='mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground'>
              {t('admin.ai.vector.detail.content', 'Full content')}
            </p>
            {isLoading ? (
              <div className='flex items-center gap-2 text-muted-foreground'>
                <IconLoader2 className='h-4 w-4 animate-spin' />
                <span className='text-sm'>
                  {t('common.loading', 'Loading...')}
                </span>
              </div>
            ) : (
              <div className='max-h-64 overflow-y-auto rounded border bg-muted/30 p-3'>
                <p className='whitespace-pre-wrap text-sm'>
                  {data?.contentExcerpt ?? doc.contentExcerpt}
                </p>
              </div>
            )}
          </div>

          <div>
            <p className='mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground'>
              {t('admin.ai.vector.detail.metadata', 'Metadata')}
            </p>
            <div className='max-h-48 overflow-y-auto rounded border bg-muted/30 p-3'>
              <pre className='text-xs'>
                {JSON.stringify(doc.metadata, null, 2)}
              </pre>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            {t('common.close', 'Close')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
