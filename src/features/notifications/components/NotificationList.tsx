import {
  NotificationItem,
  type NotificationItemProps,
} from './NotificationItem';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Bell, Check } from 'lucide-react';

export interface NotificationListProps {
  notifications: Omit<NotificationItemProps, 'onClick' | 'onMarkAsRead'>[];
  maxHeight?: number;
  onNotificationClick?: (id: string) => void;
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onViewAll?: () => void;
}

export function NotificationList({
  notifications,
  maxHeight = 400,
  onNotificationClick,
  onMarkAsRead,
  onMarkAllAsRead,
  onViewAll,
}: NotificationListProps) {
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (notifications.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-8 text-center'>
        <Bell className='mb-2 h-12 w-12 text-muted-foreground/50' />
        <p className='text-sm font-medium'>No notifications</p>
        <p className='text-xs text-muted-foreground'>You're all caught up!</p>
      </div>
    );
  }

  return (
    <div className='flex flex-col'>
      {/* Header */}
      <div className='flex items-center justify-between border-b px-4 py-2'>
        <div className='flex items-center gap-2'>
          <span className='font-medium'>Notifications</span>
          {unreadCount > 0 && (
            <span className='flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs text-primary-foreground'>
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && onMarkAllAsRead && (
          <Button
            variant='ghost'
            size='sm'
            className='h-8 text-xs'
            onClick={onMarkAllAsRead}
          >
            <Check className='mr-1 h-3 w-3' />
            Mark all read
          </Button>
        )}
      </div>

      {/* List */}
      <ScrollArea style={{ maxHeight }}>
        <div className='divide-y'>
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              {...notification}
              onClick={onNotificationClick}
              onMarkAsRead={onMarkAsRead}
            />
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      {onViewAll && (
        <div className='border-t p-2'>
          <Button
            variant='ghost'
            size='sm'
            className='w-full'
            onClick={onViewAll}
          >
            View all notifications
          </Button>
        </div>
      )}
    </div>
  );
}

export default NotificationList;
