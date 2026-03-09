export type AiTargetType = 'CHAT' | 'SEARCH';

export interface AiParameterSummary {
  id: string;
  description: string | null;
  targetType: AiTargetType;
  active: boolean;
}

export interface AiParameterDetail extends AiParameterSummary {
  content: string;
}

export interface CreateAiParameterRequest {
  targetType: AiTargetType;
  description?: string | null;
  content: string;
}

export interface UpdateAiParameterRequest {
  content: string;
  description?: string | null;
}
