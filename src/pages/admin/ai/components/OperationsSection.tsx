import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface OperationsSectionProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function OperationsSection({
  title,
  description,
  actions,
  children,
  className,
  contentClassName,
}: OperationsSectionProps) {
  return (
    <Card className={cn('border-border/70 shadow-sm', className)}>
      <CardHeader className='gap-3 border-b bg-muted/20'>
        <div className='space-y-1'>
          <CardTitle className='text-base tracking-tight'>{title}</CardTitle>
          {description ? (
            <CardDescription className='max-w-3xl'>
              {description}
            </CardDescription>
          ) : null}
        </div>
        {actions ? <CardAction>{actions}</CardAction> : null}
      </CardHeader>
      <CardContent className={cn('p-4 md:p-6', contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
}

export function OperationsMetricGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('grid gap-3 md:grid-cols-3', className)}>{children}</div>
  );
}

interface OperationsMetricCardProps {
  label: string;
  value: string;
  hint?: string;
  icon?: LucideIcon;
}

export function OperationsMetricCard({
  label,
  value,
  hint,
  icon: Icon,
}: OperationsMetricCardProps) {
  return (
    <div className='rounded-2xl border border-border/70 bg-background p-4 shadow-sm'>
      <div className='flex items-start justify-between gap-3'>
        <div className='space-y-2'>
          <p className='text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase'>
            {label}
          </p>
          <p className='text-2xl font-semibold tracking-tight'>{value}</p>
        </div>
        {Icon ? (
          <div className='rounded-xl border bg-muted/40 p-2 text-muted-foreground'>
            <Icon className='size-4' />
          </div>
        ) : null}
      </div>
      {hint ? (
        <p className='mt-3 text-sm text-muted-foreground'>{hint}</p>
      ) : null}
    </div>
  );
}
