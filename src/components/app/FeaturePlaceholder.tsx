import type { ReactNode } from 'react';

import { Construction } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type FeaturePlaceholderProps = {
  action?: ReactNode;
  description: string;
  items?: readonly string[];
  title: string;
};

export function FeaturePlaceholder({
  action,
  description,
  items = [],
  title,
}: FeaturePlaceholderProps) {
  return (
    <Card className='border-dashed'>
      <CardHeader>
        <div className='flex items-center gap-3'>
          <div className='rounded-full bg-muted p-2'>
            <Construction className='h-5 w-5 text-muted-foreground' />
          </div>
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      {(items.length > 0 || action) && (
        <CardContent className='space-y-4'>
          {items.length > 0 ? (
            <ul className='list-disc space-y-2 pl-5 text-sm text-muted-foreground'>
              {items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
          {action}
        </CardContent>
      )}
    </Card>
  );
}
