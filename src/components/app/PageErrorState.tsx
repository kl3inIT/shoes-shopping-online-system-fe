import type { ReactNode } from 'react';

import { AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/button';

type PageErrorStateProps = {
  action?: ReactNode;
  description?: string;
  title?: string;
};

export function PageErrorState({
  action,
  description = 'Something went wrong while loading this page.',
  title = 'Unable to load page',
}: PageErrorStateProps) {
  return (
    <div className='flex min-h-[16rem] flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-destructive/40 bg-destructive/5 p-8 text-center'>
      <AlertTriangle className='h-8 w-8 text-destructive' />
      <div className='space-y-1'>
        <p className='font-semibold text-destructive'>{title}</p>
        <p className='text-sm text-muted-foreground'>{description}</p>
      </div>
      {action}
    </div>
  );
}

export function ReloadPageButton() {
  return (
    <Button variant='outline' onClick={() => globalThis.location.reload()}>
      Retry
    </Button>
  );
}
