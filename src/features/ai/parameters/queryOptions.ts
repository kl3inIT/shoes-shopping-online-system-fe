import { queryOptions } from '@tanstack/react-query';
import { listAiParameters, getAiParameter } from './api';
import type {
  AiParameterDetail,
  AiParameterSummary,
  AiTargetType,
} from './types';

export const aiParameterKeys = {
  all: ['ai-parameters'] as const,
  lists: () => [...aiParameterKeys.all, 'list'] as const,
  list: (type: AiTargetType | 'ALL') =>
    [...aiParameterKeys.lists(), type] as const,
  details: () => [...aiParameterKeys.all, 'detail'] as const,
  detail: (id: string) => [...aiParameterKeys.details(), id] as const,
};

export const aiParametersListQueryOptions = (type?: AiTargetType) =>
  queryOptions<AiParameterSummary[]>({
    queryKey: aiParameterKeys.list(type ?? 'ALL'),
    queryFn: () => listAiParameters(type),
  });

export const aiParameterDetailQueryOptions = (id: string) =>
  queryOptions<AiParameterDetail>({
    queryKey: aiParameterKeys.detail(id),
    queryFn: () => getAiParameter(id),
    enabled: !!id,
  });
