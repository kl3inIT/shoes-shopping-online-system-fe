import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@/features/apiClient';
import {
  deleteVectorDocument,
  deleteVectorDocumentsByIds,
  deleteVectorDocuments,
  ingestAll,
  ingestByType,
} from './api';
import type { GetVectorDocumentsParams } from './types';
import {
  adminVectorDocsQueryOptions,
  adminVectorDocQueryOptions,
  adminIngesterTypesQueryOptions,
} from './queryOptions';

export function useQueryVectorDocs(params: GetVectorDocumentsParams) {
  return useQuery(adminVectorDocsQueryOptions(params));
}

export function useQueryVectorDocument(id: string) {
  return useQuery(adminVectorDocQueryOptions(id));
}

export function useQueryIngesterTypes() {
  return useQuery(adminIngesterTypesQueryOptions());
}

export function useDeleteVectorDocumentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteVectorDocument(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['admin', 'vector-store'],
      });
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}

export function useDeleteVectorDocumentsByIdsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => deleteVectorDocumentsByIds(ids),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['admin', 'vector-store'],
      });
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}

export function useDeleteVectorDocumentsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (filter: string) => deleteVectorDocuments(filter),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['admin', 'vector-store'],
      });
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}

export function useIngestMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => ingestAll(),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({
        queryKey: ['admin', 'vector-store'],
      });
      toast.success(data);
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}

export function useIngestByTypeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (type: string) => ingestByType(type),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({
        queryKey: ['admin', 'vector-store'],
      });
      toast.success(data);
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}
