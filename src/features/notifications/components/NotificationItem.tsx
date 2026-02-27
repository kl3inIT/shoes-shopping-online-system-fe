import { Package, Tag, Bell, CreditCard, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type NotificationType =
  | 'order'
  | 'promotion'
  | 'system'
  | 'payment'
  | 'delivery';

export interface NotificationItemProps {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  isRead?: boolean;
  link?: string;
  onClick?: (id: string) => void;
  onMarkAsRead?: (id: string) => void;
}

const typeConfig: Record<
  NotificationType,
  { icon: typeof Bell; color: string }
> = {
  order: { icon: Package, color: 'text-blue-500' },
  promotion: { icon: Tag, color: 'text-green-500' },
  system: { icon: Bell, color: 'text-gray-500' },
  payment: { icon: CreditCard, color: 'text-purple-500' },
  delivery: { icon: CheckCircle, color: 'text-orange-500' },
};

export function NotificationItem({
  id,
  type,
  title,
  message,
  createdAt,
  isRead = false,
  onClick,
  onMarkAsRead,
}: NotificationItemProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  const timeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const handleClick = () => {
    if (!isRead) {
      onMarkAsRead?.(id);
    }
    onClick?.(id);
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        'flex cursor-pointer gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50',
        !isRead && 'bg-primary/5'
      )}
    >
      <div
        className={cn(
          'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-muted',
          config.color
        )}
      >
        <Icon className='h-5 w-5' />
      </div>

      <div className='flex-1 space-y-1'>
        <div className='flex items-start justify-between gap-2'>
          <p className={cn('text-sm font-medium', !isRead && 'font-semibold')}>
            {title}
          </p>
          {!isRead && (
            <span className='mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-primary' />
          )}
        </div>
        <p className='line-clamp-2 text-xs text-muted-foreground'>{message}</p>
        <p className='text-xs text-muted-foreground'>{timeAgo(createdAt)}</p>
      </div>
    </div>
  );
}

export default NotificationItem;
