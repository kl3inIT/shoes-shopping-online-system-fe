import { queryOptions } from '@tanstack/react-query';
import { getAdminUsers, getAdminUserStats } from './api';
import type { GetAdminUsersParams } from './types';

export const adminUsersQueryKey = (params: GetAdminUsersParams) =>
  ['admin', 'users', params] as const;

export const adminUsersQueryOptions = (params: GetAdminUsersParams) =>
  queryOptions({
    queryKey: adminUsersQueryKey(params),
    queryFn: () => getAdminUsers(params),
  });

export const adminUserStatsQueryKey = () =>
  ['admin', 'users', 'stats'] as const;

export const adminUserStatsQueryOptions = () =>
  queryOptions({
    queryKey: adminUserStatsQueryKey(),
    queryFn: () => getAdminUserStats(),
  });
