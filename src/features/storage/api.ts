import type { ApiSuccessResponse } from '@/types';
import apiClient from '@/features/apiClient';

/** Presigned URL response from GET /api/storage/presigned-url */
export interface PresignedUrlDto {
  url: string;
}

/**
 * Lấy presigned URL để GET (xem) hoặc PUT (upload).
 * action: 'GET' | 'PUT'
 */
export async function getPresignedUrl(
  objectKey: string,
  action: 'GET' | 'PUT' = 'GET'
): Promise<string> {
  const response = await apiClient.get<
    ApiSuccessResponse<Record<string, string>>
  >('/api/storage/presigned-url', {
    params: { objectKey, action },
  });
  return response.data.data.url;
}

/** Xóa object trong MinIO. */
export async function deleteStorageObject(objectKey: string): Promise<void> {
  await apiClient.delete('/api/storage', { params: { objectKey } });
}

/**
 * Upload file lên MinIO: lấy presigned PUT URL rồi PUT file lên đó.
 * Trả về presigned GET URL để dùng làm logoUrl (hoặc hiển thị).
 */
export async function uploadFileToStorage(
  file: File,
  objectKey: string
): Promise<string> {
  const putUrl = await getPresignedUrl(objectKey, 'PUT');
  await fetch(putUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type || 'application/octet-stream',
    },
  });
  return getPresignedUrl(objectKey, 'GET');
}
