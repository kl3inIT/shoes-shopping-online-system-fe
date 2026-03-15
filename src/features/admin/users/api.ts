import type { ApiSuccessResponse } from '@/types';
import apiClient from '@/features/apiClient';
import type {
  AdminUser,
  AdminUserPageResponse,
  AdminUserStats,
  CreateAdminUserPayload,
  GetAdminUsersParams,
  UserRole,
  UserStatus,
} from './types';

export async function getAdminUsers(
  params: GetAdminUsersParams
): Promise<AdminUserPageResponse> {
  const response = await apiClient.get<
    ApiSuccessResponse<AdminUserPageResponse>
  >('/api/v1/admin/users', {
    params: {
      page: params.page ?? 0,
      size: params.size ?? 20,
      ...(params.search ? { search: params.search } : {}),
      ...(params.role ? { role: params.role } : {}),
      ...(params.status ? { status: params.status } : {}),
    },
  });
  return response.data.data;
}

export async function createAdminUser(
  payload: CreateAdminUserPayload
): Promise<AdminUser> {
  const response = await apiClient.post<ApiSuccessResponse<AdminUser>>(
    '/api/v1/admin/users',
    payload
  );
  return response.data.data;
}

export async function updateUserRole(
  keycloakId: string,
  role: UserRole
): Promise<AdminUser> {
  const response = await apiClient.patch<ApiSuccessResponse<AdminUser>>(
    `/api/v1/admin/users/${keycloakId}/role`,
    { role }
  );
  return response.data.data;
}

export async function updateUserStatus(
  keycloakId: string,
  status: UserStatus
): Promise<AdminUser> {
  const response = await apiClient.patch<ApiSuccessResponse<AdminUser>>(
    `/api/v1/admin/users/${keycloakId}/status`,
    { status }
  );
  return response.data.data;
}

export async function deleteAdminUser(keycloakId: string): Promise<void> {
  await apiClient.delete(`/api/v1/admin/users/${keycloakId}`);
}

export async function getAdminUserStats(): Promise<AdminUserStats> {
  const response = await apiClient.get<ApiSuccessResponse<AdminUserStats>>(
    '/api/v1/admin/users/stats'
  );
  return response.data.data;
}

export async function toggleUserStatus(keycloakId: string): Promise<AdminUser> {
  const response = await apiClient.post<ApiSuccessResponse<AdminUser>>(
    `/api/v1/admin/users/${keycloakId}/status/toggle`
  );
  return response.data.data;
}
