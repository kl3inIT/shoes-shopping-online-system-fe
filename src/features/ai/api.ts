import apiClient from '@/features/apiClient';
import type { ApiSuccessResponse } from '@/types/apiTypes';
import type { ChatApiData, ChatRequestDto } from './types';

export async function sendChat(
  message: string,
  options?: { threadId?: string; skipAuth?: boolean }
): Promise<ChatApiData> {
  const headers: Record<string, string> = {};

  if (options?.threadId) {
    headers['X-Thread-Id'] = options.threadId;
  }

  const response = await apiClient.post<ApiSuccessResponse<ChatApiData>>(
    '/api/v1/chat',
    {
      message,
    } as ChatRequestDto,
    {
      headers,
      // backend đã cho /api/v1/chat vào public-endpoints
      // nhưng vẫn cho phép bật auth nếu cần sau này
      skipAuth: options?.skipAuth ?? true,
    }
  );

  return response.data.data;
}
