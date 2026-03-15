import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { getErrorMessage } from '@/features/apiClient';
import {
  createCheckDef,
  updateCheckDef,
  deleteCheckDef,
  deleteCheckRun,
  triggerCheckRun,
} from './api';
import type { CheckDefCreatePayload, GetCheckRunsParams } from './types';
import {
  adminCheckDefsQueryOptions,
  adminCheckRunsQueryOptions,
  adminCheckResultsQueryOptions,
} from './queryOptions';

export function useQueryCheckDefs() {
  return useQuery(adminCheckDefsQueryOptions());
}

export function useQueryCheckRuns(params: GetCheckRunsParams) {
  return useQuery(
    adminCheckRunsQueryOptions({
      page: params.page ?? 0,
      size: params.size ?? 20,
    })
  );
}

export function useQueryCheckResults(runId: string | null) {
  return useQuery(adminCheckResultsQueryOptions(runId ?? ''));
}

export function useCreateCheckDefMutation() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  return useMutation({
    mutationFn: (payload: CheckDefCreatePayload) => createCheckDef(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['admin', 'checks', 'definitions'],
      });
      toast.success(
        t('admin.ai.checks.toast.created', 'Check definition created')
      );
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}

export function useUpdateCheckDefMutation() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<CheckDefCreatePayload>;
    }) => updateCheckDef(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['admin', 'checks', 'definitions'],
      });
      toast.success(
        t('admin.ai.checks.toast.updated', 'Check definition updated')
      );
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}

export function useToggleCheckDefMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      updateCheckDef(id, { active }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['admin', 'checks', 'definitions'],
      });
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}

export function useDeleteCheckDefMutation() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  return useMutation({
    mutationFn: (id: string) => deleteCheckDef(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['admin', 'checks', 'definitions'],
      });
      toast.success(
        t('admin.ai.checks.toast.deleted', 'Check definition deleted')
      );
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}

export function useDeleteCheckRunMutation() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  return useMutation({
    mutationFn: (id: string) => deleteCheckRun(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['admin', 'checks', 'runs'],
      });
      toast.success(t('admin.ai.checks.toast.runDeleted', 'Run deleted'));
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}

export function useTriggerRunMutation(options?: {
  onScore?: (score: number | null) => void;
}) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  return useMutation({
    mutationFn: () => triggerCheckRun(),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({
        queryKey: ['admin', 'checks', 'runs'],
      });
      if (data !== null) {
        options?.onScore?.(data.score);
        toast.success(
          data.score !== null
            ? t(
                'admin.ai.checks.toast.runComplete',
                'Run complete — score: {{score}}',
                { score: data.score.toFixed(2) }
              )
            : t(
                'admin.ai.checks.toast.runCompleteNoScore',
                'Check run completed'
              )
        );
      } else {
        toast.warning(
          t(
            'admin.ai.checks.toast.noActiveDefs',
            'No active check definitions found'
          )
        );
      }
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}
