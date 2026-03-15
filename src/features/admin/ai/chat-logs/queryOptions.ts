import { keepPreviousData, queryOptions } from '@tanstack/react-query';
import { getChatLogs, getChatLog } from './api';
import type { GetChatLogsParams } from './types';

export const adminChatLogsQueryOptions = (params: GetChatLogsParams) =>
  queryOptions({
    queryKey: ['admin', 'chat-logs', 'list', params],
    queryFn: () => getChatLogs(params),
    placeholderData: keepPreviousData,
  });

export const adminChatLogQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ['admin', 'chat-logs', id],
    queryFn: () => getChatLog(id),
    enabled: !!id,
  });
