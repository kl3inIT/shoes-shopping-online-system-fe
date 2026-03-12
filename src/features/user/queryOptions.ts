import { queryOptions } from '@tanstack/react-query';
import { getMe, getUserById } from './api';
import type { User } from './types';

export const userKeys = {
  all: ['users'] as const,
  me: () => [...userKeys.all, 'me'] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

export const getMeQueryOptions = () =>
  queryOptions<User>({
    queryKey: userKeys.me(),
    queryFn: () => getMe(),
  });

export const getUserDetailQueryOptions = (id: string) =>
  queryOptions<User>({
    queryKey: userKeys.detail(id),
    queryFn: () => getUserById(id),
    enabled: !!id,
  });
