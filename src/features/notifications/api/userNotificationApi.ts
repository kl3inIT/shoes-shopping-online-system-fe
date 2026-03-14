import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/features/apiClient';
import { type ApiSuccessResponse } from '@/types/apiTypes';
import {
  type NotificationItemProps,
  type NotificationType,
} from '@/features/notifications/components/NotificationItem';

export type UserNotification = Omit<
  NotificationItemProps,
  'onClick' | 'onMarkAsRead'
>;

export const userNotificationKeys = {
  all: ['user', 'notifications'] as const,
  list: () => [...userNotificationKeys.all, 'list'] as const,
};

export const useUserNotifications = () => {
  return useQuery({
    queryKey: userNotificationKeys.list(),
    queryFn: async () => {
      const response = await apiClient.get<
        ApiSuccessResponse<
          {
            id: string;
            notificationId: string;
            title: string;
            message: string;
            type: NotificationType;
            isRead: boolean;
            createdAt: string;
          }[]
        >
      >('/notifications');

      return response.data.data.map((n) => ({
        id: n.id,
        type: n.type,
        title: n.title,
        message: n.message,
        createdAt: n.createdAt,
        isRead: n.isRead,
      })) as UserNotification[];
    },
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userNotificationId: string) => {
      await apiClient.post(`/notifications/${userNotificationId}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userNotificationKeys.all });
    },
  });
};
