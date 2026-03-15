import type { ApiSuccessResponse } from '@/types';
import apiClient from '@/features/apiClient';
import type {
  CheckDef,
  CheckDefCreatePayload,
  CheckRunSummary,
  CheckRunPage,
  CheckRunResult,
  GetCheckRunsParams,
} from './types';

export async function getCheckDefs(): Promise<CheckDef[]> {
  const response = await apiClient.get<ApiSuccessResponse<CheckDef[]>>(
    '/api/v1/admin/checks/definitions'
  );
  return response.data.data;
}

export async function createCheckDef(
  payload: CheckDefCreatePayload
): Promise<CheckDef> {
  const response = await apiClient.post<ApiSuccessResponse<CheckDef>>(
    '/api/v1/admin/checks/definitions',
    payload
  );
  return response.data.data;
}

export async function updateCheckDef(
  id: string,
  payload: Partial<CheckDefCreatePayload>
): Promise<CheckDef> {
  const response = await apiClient.put<ApiSuccessResponse<CheckDef>>(
    `/api/v1/admin/checks/definitions/${id}`,
    payload
  );
  return response.data.data;
}

export async function deleteCheckDef(id: string): Promise<void> {
  await apiClient.delete(`/api/v1/admin/checks/definitions/${id}`);
}

export async function triggerCheckRun(): Promise<CheckRunSummary | null> {
  const response = await apiClient.post<
    ApiSuccessResponse<CheckRunSummary | null>
  >('/api/v1/admin/checks/runs');
  return response.data.data;
}

export async function getCheckRuns(
  params: GetCheckRunsParams
): Promise<CheckRunPage> {
  const response = await apiClient.get<ApiSuccessResponse<CheckRunPage>>(
    '/api/v1/admin/checks/runs',
    {
      params: {
        page: params.page ?? 0,
        size: params.size ?? 20,
      },
    }
  );
  return response.data.data;
}

export async function getCheckResults(
  runId: string
): Promise<CheckRunResult[]> {
  const response = await apiClient.get<ApiSuccessResponse<CheckRunResult[]>>(
    `/api/v1/admin/checks/runs/${runId}/results`
  );
  return response.data.data;
}
