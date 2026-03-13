import { queryOptions } from '@tanstack/react-query';
import { getAdminUsers } from './api';
import type { GetAdminUsersParams } from './types';

export const adminUsersQueryKey = (params: GetAdminUsersParams) =>
  ['admin', 'users', params] as const;

export const adminUsersQueryOptions = (params: GetAdminUsersParams) =>
  queryOptions({
    queryKey: adminUsersQueryKey(params),
    queryFn: () => getAdminUsers(params),
  });
