import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { getMeQueryOptions, getUserDetailQueryOptions } from './queryOptions';
import { updateMyProfile } from './api';
import type { UpdateUserProfilePayload } from './types';

export const useUserDetailQuery = (id: string) =>
  useSuspenseQuery(getUserDetailQueryOptions(id));

export const useMeQuery = () => useSuspenseQuery(getMeQueryOptions());

export function useUpdateMyProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateUserProfilePayload) => updateMyProfile(payload),
    onSuccess: async (user) => {
      await queryClient.invalidateQueries({
        queryKey: getMeQueryOptions().queryKey,
      });
      queryClient.setQueryData(getMeQueryOptions().queryKey, user);
    },
  });
}
