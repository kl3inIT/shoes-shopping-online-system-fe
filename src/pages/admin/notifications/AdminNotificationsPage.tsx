import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconSend, IconFilter } from '@tabler/icons-react';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import {
  NotificationList,
  type NotificationType,
} from '@/features/notifications/components';
import {
  useAdminNotifications,
  useBroadcastNotification,
} from '@/features/notifications/api/adminNotificationApi';
import { toast } from 'sonner';

const notificationTypeOptions: { value: NotificationType; label: string }[] = [
  { value: 'SYSTEM', label: 'System' },
  { value: 'PROMOTION', label: 'Promotion' },
  { value: 'ORDER', label: 'Order' },
  { value: 'PAYMENT', label: 'Payment' },
  { value: 'DELIVERY', label: 'Delivery' },
];

export default function AdminNotificationsPage() {
  const { t } = useTranslation();

  const [filterType, setFilterType] = useState<'all' | NotificationType>('all');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<NotificationType>('SYSTEM');

  const { data: notifications = [], isLoading } =
    useAdminNotifications(filterType);
  const broadcastMutation = useBroadcastNotification();

  const handleBroadcast = () => {
    if (!title.trim() || !message.trim()) {
      toast.error(t('admin.notifications.form.required'));
      return;
    }

    broadcastMutation.mutate(
      {
        title: title.trim(),
        message: message.trim(),
        type,
      },
      {
        onSuccess: () => {
          toast.success(t('admin.notifications.form.success'));
          setTitle('');
          setMessage('');
        },
        onError: () => {
          toast.error(t('admin.notifications.form.error'));
        },
      }
    );
  };

  return (
    <div className='flex flex-col gap-4 py-4'>
      {/* Header */}
      <div className='flex items-center justify-between px-4 lg:px-6'>
        <div>
          <h1 className='text-2xl font-bold'>
            {t('admin.notifications.title', 'System notifications')}
          </h1>
          <p className='text-muted-foreground'>
            {t(
              'admin.notifications.subtitle',
              'Send system notifications to all users and manage them'
            )}
          </p>
        </div>
      </div>

      <div className='grid gap-4 px-4 lg:grid-cols-3 lg:px-6'>
        {/* Form gửi thông báo */}
        <Card className='lg:col-span-1'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <IconSend className='h-5 w-5' />
              {t('admin.notifications.form.title', 'Send notification')}
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>
                {t('admin.notifications.form.type', 'Type')}
              </label>
              <Select
                value={type}
                onValueChange={(value: NotificationType) => setType(value)}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t(
                      'admin.notifications.form.typePlaceholder',
                      'Select type'
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  {notificationTypeOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-medium'>
                {t('admin.notifications.form.titleLabel', 'Title')}
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t(
                  'admin.notifications.form.titlePlaceholder',
                  'Enter notification title'
                )}
              />
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-medium'>
                {t('admin.notifications.form.messageLabel', 'Message')}
              </label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                placeholder={t(
                  'admin.notifications.form.messagePlaceholder',
                  'Enter notification content'
                )}
              />
            </div>

            <Button
              className='w-full'
              onClick={handleBroadcast}
              disabled={broadcastMutation.isPending}
            >
              <IconSend className='mr-2 h-4 w-4' />
              {t('admin.notifications.form.submit', 'Send to all users')}
            </Button>
          </CardContent>
        </Card>

        {/* Danh sách thông báo với filter hình thức */}
        <Card className='lg:col-span-2'>
          <CardHeader>
            <CardTitle className='flex items-center justify-between'>
              <span>
                {t('admin.notifications.list.title', 'Notifications list')}
              </span>
              <div className='flex items-center gap-2'>
                <IconFilter className='h-4 w-4 text-muted-foreground' />
                <Select
                  value={filterType}
                  onValueChange={(value: 'all' | NotificationType) =>
                    setFilterType(value)
                  }
                >
                  <SelectTrigger className='w-[160px]'>
                    <SelectValue
                      placeholder={t(
                        'admin.notifications.list.filterPlaceholder',
                        'Filter by type'
                      )}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>
                      {t('admin.notifications.list.filterAll', 'All types')}
                    </SelectItem>
                    {notificationTypeOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Separator className='mb-4' />
            {isLoading ? (
              <div className='flex h-40 items-center justify-center'>
                <p>{t('common.loading')}</p>
              </div>
            ) : (
              <NotificationList notifications={notifications} maxHeight={420} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
