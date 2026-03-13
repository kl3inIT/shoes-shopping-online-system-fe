import { Loader2 } from 'lucide-react';

type PageLoaderProps = {
  className?: string;
  description?: string;
  title?: string;
};

export function PageLoader({
  className,
  description = 'Please wait while we load this page.',
  title = 'Loading',
}: PageLoaderProps) {
  return (
    <div
      className={`flex min-h-[16rem] flex-col items-center justify-center gap-3 rounded-lg border border-dashed bg-muted/20 p-8 text-center ${className ?? ''}`}
    >
      <Loader2 className='h-8 w-8 animate-spin text-primary' />
      <div className='space-y-1'>
        <p className='font-medium'>{title}</p>
        <p className='text-sm text-muted-foreground'>{description}</p>
      </div>
    </div>
  );
}
