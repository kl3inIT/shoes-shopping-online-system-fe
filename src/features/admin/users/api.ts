import type { ApiSuccessResponse } from '@/types';
import apiClient from '@/features/apiClient';
import type {
  AdminUser,
  AdminUserPageResponse,
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
  >('/api/admin/users', {
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
    '/api/admin/users',
    payload
  );
  return response.data.data;
}

export async function updateUserRole(
  keycloakId: string,
  role: UserRole
): Promise<AdminUser> {
  const response = await apiClient.patch<ApiSuccessResponse<AdminUser>>(
    `/api/admin/users/${keycloakId}/role`,
    { role }
  );
  return response.data.data;
}

export async function updateUserStatus(
  keycloakId: string,
  status: UserStatus
): Promise<AdminUser> {
  const response = await apiClient.patch<ApiSuccessResponse<AdminUser>>(
    `/api/admin/users/${keycloakId}/status`,
    { status }
  );
  return response.data.data;
}

export async function deleteAdminUser(keycloakId: string): Promise<void> {
  await apiClient.delete(`/api/admin/users/${keycloakId}`);
}
