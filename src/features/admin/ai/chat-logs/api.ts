import type { ApiSuccessResponse } from '@/types';
import apiClient from '@/features/apiClient';
import type { ChatLogPage, ChatLogDetail, GetChatLogsParams } from './types';

export async function getChatLogs(
  params: GetChatLogsParams
): Promise<ChatLogPage> {
  const response = await apiClient.get<ApiSuccessResponse<ChatLogPage>>(
    '/api/admin/chat-logs',
    {
      params: {
        page: params.page ?? 0,
        size: params.size ?? 20,
        ...(params.conversationId
          ? { conversationId: params.conversationId }
          : {}),
        ...(params.from ? { from: params.from } : {}),
        ...(params.to ? { to: params.to } : {}),
      },
    }
  );
  return response.data.data;
}

export async function getChatLog(id: string): Promise<ChatLogDetail> {
  const response = await apiClient.get<ApiSuccessResponse<ChatLogDetail>>(
    `/api/admin/chat-logs/${id}`
  );
  return response.data.data;
}
