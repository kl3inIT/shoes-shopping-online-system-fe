import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/features/apiClient';
import { type ApiSuccessResponse } from '@/types/apiTypes';
import {
  type NotificationType,
  type NotificationItemProps,
} from '@/features/notifications/components/NotificationItem';

export type AdminNotification = Omit<
  NotificationItemProps,
  'onClick' | 'onMarkAsRead'
>;

export interface NotificationBroadcastRequest {
  title: string;
  message: string;
  type: NotificationType;
}

export const adminNotificationKeys = {
  all: ['admin', 'notifications'] as const,
  list: (type?: NotificationType | 'all') =>
    type && type !== 'all'
      ? [...adminNotificationKeys.all, 'list', type]
      : [...adminNotificationKeys.all, 'list'],
};

export const useAdminNotifications = (type?: NotificationType | 'all') => {
  return useQuery({
    queryKey: adminNotificationKeys.list(type),
    queryFn: async () => {
      const response = await apiClient.get<
        ApiSuccessResponse<
          {
            id: string;
            title: string;
            message: string;
            type: NotificationType;
            createdAt: string;
          }[]
        >
      >('/admin/notifications', {
        params: type && type !== 'all' ? { type } : undefined,
      });

      // Map về format dùng cho NotificationItem
      return response.data.data.map((n) => ({
        id: n.id,
        type: n.type,
        title: n.title,
        message: n.message,
        createdAt: n.createdAt,
        isRead: true,
      })) as AdminNotification[];
    },
  });
};

export const useBroadcastNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: NotificationBroadcastRequest) => {
      const response = await apiClient.post<
        ApiSuccessResponse<{
          id: string;
          title: string;
          message: string;
          type: NotificationType;
          createdAt: string;
        }>
      >('/admin/notifications/broadcast', payload);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminNotificationKeys.all });
    },
  });
};
