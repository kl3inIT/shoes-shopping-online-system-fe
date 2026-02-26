import { useSuspenseQuery } from '@tanstack/react-query';
import { getUserDetailQueryOptions } from './queryOptions';

export const useUserDetailQuery = (id: string) =>
  useSuspenseQuery(getUserDetailQueryOptions(id));
