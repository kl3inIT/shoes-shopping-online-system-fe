import type { ReactNode } from 'react';

import { Inbox } from 'lucide-react';

type PageEmptyStateProps = {
  action?: ReactNode;
  description?: string;
  title?: string;
};

export function PageEmptyState({
  action,
  description = 'There is nothing to show here yet.',
  title = 'No data available',
}: PageEmptyStateProps) {
  return (
    <div className='flex min-h-[16rem] flex-col items-center justify-center gap-4 rounded-lg border border-dashed bg-muted/20 p-8 text-center'>
      <Inbox className='h-8 w-8 text-muted-foreground' />
      <div className='space-y-1'>
        <p className='font-medium'>{title}</p>
        <p className='text-sm text-muted-foreground'>{description}</p>
      </div>
      {action}
    </div>
  );
}
