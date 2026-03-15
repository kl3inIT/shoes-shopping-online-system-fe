import { useQuery } from '@tanstack/react-query';
import {
  adminChatLogsQueryOptions,
  adminChatLogQueryOptions,
} from './queryOptions';
import type { GetChatLogsParams } from './types';

export function useQueryChatLogs(params: GetChatLogsParams) {
  return useQuery(adminChatLogsQueryOptions(params));
}

export function useQueryChatLog(id: string) {
  return useQuery(adminChatLogQueryOptions(id));
}
