export interface ChatLogSummary {
  id: string;
  createdAt: string;
  conversationId: string | null;
  promptTokens: number | null;
  completionTokens: number | null;
  responseTimeMs: number | null;
  contentExcerpt: string | null;
  sourcesExcerpt: string | null;
}

export interface ChatLogDetail extends ChatLogSummary {
  logContent: string | null;
  sources: string | null;
}

export interface ChatLogPage {
  content: ChatLogSummary[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface GetChatLogsParams {
  page?: number;
  size?: number;
  conversationId?: string;
  from?: string;
  to?: string;
}
