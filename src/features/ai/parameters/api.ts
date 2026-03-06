import apiClient from '@/features/apiClient';
import type { ApiSuccessResponse } from '@/types/apiTypes';
import type {
  AiParameterDetail,
  AiParameterSummary,
  AiTargetType,
  CreateAiParameterRequest,
  UpdateAiParameterRequest,
} from './types';

/** Base path không kết thúc bằng / để tránh request bị Spring xử lý nhầm là static resource. */
const BASE_PATH = '/api/v1/ai-parameters'.replace(/\/+$/, '');

export async function listAiParameters(
  type?: AiTargetType
): Promise<AiParameterSummary[]> {
  const response = await apiClient.get<
    ApiSuccessResponse<AiParameterSummary[]>
  >(BASE_PATH, {
    params: type ? { type } : undefined,
  });
  return response.data.data;
}

export async function getAiParameter(id: string): Promise<AiParameterDetail> {
  const response = await apiClient.get<ApiSuccessResponse<AiParameterDetail>>(
    `${BASE_PATH}/${id}`
  );
  return response.data.data;
}

export async function createAiParameter(
  payload: CreateAiParameterRequest
): Promise<AiParameterDetail> {
  const response = await apiClient.post<ApiSuccessResponse<AiParameterDetail>>(
    BASE_PATH,
    payload
  );
  return response.data.data;
}

export async function createAiParameterFromDefault(
  type: AiTargetType = 'CHAT'
): Promise<AiParameterDetail> {
  const response = await apiClient.post<ApiSuccessResponse<AiParameterDetail>>(
    `${BASE_PATH}/from-default`,
    undefined,
    {
      params: { type },
    }
  );
  return response.data.data;
}

export async function updateAiParameter(
  id: string,
  payload: UpdateAiParameterRequest
): Promise<AiParameterDetail> {
  const response = await apiClient.put<ApiSuccessResponse<AiParameterDetail>>(
    `${BASE_PATH}/${id}`,
    payload
  );
  return response.data.data;
}

export async function activateAiParameter(
  id: string
): Promise<AiParameterSummary> {
  const response = await apiClient.post<ApiSuccessResponse<AiParameterSummary>>(
    `${BASE_PATH}/${id}/activate`
  );
  return response.data.data;
}

export async function copyAiParameter(id: string): Promise<AiParameterDetail> {
  const response = await apiClient.post<ApiSuccessResponse<AiParameterDetail>>(
    `${BASE_PATH}/${id}/copy`
  );
  return response.data.data;
}

export async function deleteAiParameter(id: string): Promise<void> {
  await apiClient.delete<ApiSuccessResponse<null>>(`${BASE_PATH}/${id}`);
}
