import type { ApiSuccessResponse } from '@/types';
import apiClient from '@/features/apiClient';
import type {
  VectorDocument,
  VectorDocumentPage,
  GetVectorDocumentsParams,
} from './types';

export async function getVectorDocuments(
  params: GetVectorDocumentsParams
): Promise<VectorDocumentPage> {
  const response = await apiClient.get<ApiSuccessResponse<VectorDocumentPage>>(
    '/api/admin/vector-store/documents',
    {
      params: {
        page: params.page ?? 0,
        size: params.size ?? 20,
        ...(params.filter ? { filter: params.filter } : {}),
      },
    }
  );
  return response.data.data;
}

export async function getVectorDocument(id: string): Promise<VectorDocument> {
  const response = await apiClient.get<ApiSuccessResponse<VectorDocument>>(
    `/api/admin/vector-store/documents/${id}`
  );
  return response.data.data;
}

export async function deleteVectorDocument(id: string): Promise<void> {
  await apiClient.delete(`/api/admin/vector-store/documents/${id}`);
}

export async function deleteVectorDocumentsByIds(ids: string[]): Promise<void> {
  await apiClient.delete('/api/admin/vector-store/documents/bulk', {
    data: { ids },
  });
}

export async function deleteVectorDocuments(filter: string): Promise<void> {
  await apiClient.delete('/api/admin/vector-store/documents', {
    data: { filter },
  });
}

export async function getIngesterTypes(): Promise<string[]> {
  const response = await apiClient.get<ApiSuccessResponse<string[]>>(
    '/api/v1/ingestion/types'
  );
  return response.data.data;
}

export async function ingestAll(): Promise<string> {
  const response = await apiClient.post<ApiSuccessResponse<string>>(
    '/api/v1/ingestion/run'
  );
  return response.data.data;
}

export async function ingestByType(type: string): Promise<string> {
  const response = await apiClient.post<ApiSuccessResponse<string>>(
    `/api/v1/ingestion/run/${type}`
  );
  return response.data.data;
}
