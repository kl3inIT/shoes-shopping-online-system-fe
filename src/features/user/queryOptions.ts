import { queryOptions } from '@tanstack/react-query';
import { getUserById } from './api';
import type { User } from './types';

export const userKeys = {
  all: ['users'] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

export const getUserDetailQueryOptions = (id: string) =>
  queryOptions<User>({
    queryKey: userKeys.detail(id),
    queryFn: () => getUserById(id),
    enabled: !!id,
  });
