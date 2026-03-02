import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import {
  aiParametersListQueryOptions,
  aiParameterDetailQueryOptions,
  aiParameterKeys,
} from './queryOptions';
import {
  activateAiParameter,
  copyAiParameter,
  createAiParameter,
  createAiParameterFromDefault,
  deleteAiParameter,
  updateAiParameter,
} from './api';
import type {
  AiParameterDetail,
  AiParameterSummary,
  AiTargetType,
  CreateAiParameterRequest,
  UpdateAiParameterRequest,
} from './types';

export const useAiParametersListQuery = (type: AiTargetType) =>
  useSuspenseQuery(aiParametersListQueryOptions(type));

export const useAiParameterDetailQuery = (id: string) =>
  useSuspenseQuery(aiParameterDetailQueryOptions(id));

export function useCreateAiParameterMutation() {
  const queryClient = useQueryClient();
  return useMutation<AiParameterDetail, unknown, CreateAiParameterRequest>({
    mutationFn: (payload) => createAiParameter(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: aiParameterKeys.all });
    },
  });
}

export function useCreateAiParameterFromDefaultMutation() {
  const queryClient = useQueryClient();
  return useMutation<AiParameterDetail, unknown, AiTargetType | undefined>({
    mutationFn: (type) => createAiParameterFromDefault(type ?? 'CHAT'),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: aiParameterKeys.all });
    },
  });
}

export function useUpdateAiParameterMutation() {
  const queryClient = useQueryClient();
  return useMutation<
    AiParameterDetail,
    unknown,
    { id: string; payload: UpdateAiParameterRequest }
  >({
    mutationFn: ({ id, payload }) => updateAiParameter(id, payload),
    onSuccess: async (data) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: aiParameterKeys.all }),
        queryClient.invalidateQueries({
          queryKey: aiParameterKeys.detail(data.id),
        }),
      ]);
    },
  });
}

export function useActivateAiParameterMutation() {
  const queryClient = useQueryClient();
  return useMutation<AiParameterSummary, unknown, string>({
    mutationFn: (id) => activateAiParameter(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: aiParameterKeys.all });
    },
  });
}

export function useCopyAiParameterMutation() {
  const queryClient = useQueryClient();
  return useMutation<AiParameterDetail, unknown, string>({
    mutationFn: (id) => copyAiParameter(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: aiParameterKeys.all });
    },
  });
}

export function useDeleteAiParameterMutation() {
  const queryClient = useQueryClient();
  return useMutation<void, unknown, string>({
    mutationFn: (id) => deleteAiParameter(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: aiParameterKeys.all });
    },
  });
}
