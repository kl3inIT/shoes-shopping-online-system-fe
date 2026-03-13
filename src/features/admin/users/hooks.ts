import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createAdminUser,
  deleteAdminUser,
  updateUserRole,
  updateUserStatus,
} from './api';
import type {
  CreateAdminUserPayload,
  GetAdminUsersParams,
  UserRole,
  UserStatus,
} from './types';
import { adminUsersQueryOptions } from './queryOptions';

export function useQueryAdminUsers(params: GetAdminUsersParams) {
  return useQuery(adminUsersQueryOptions(params));
}

export function useCreateAdminUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAdminUserPayload) => createAdminUser(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}

export function useUpdateUserRoleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      keycloakId,
      role,
    }: {
      keycloakId: string;
      role: UserRole;
    }) => updateUserRole(keycloakId, role),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}

export function useUpdateUserStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      keycloakId,
      status,
    }: {
      keycloakId: string;
      status: UserStatus;
    }) => updateUserStatus(keycloakId, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}

export function useDeleteAdminUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (keycloakId: string) => deleteAdminUser(keycloakId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}
