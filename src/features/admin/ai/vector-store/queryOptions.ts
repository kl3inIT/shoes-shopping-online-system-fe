import { keepPreviousData, queryOptions } from '@tanstack/react-query';
import { getVectorDocuments, getVectorDocument, getIngesterTypes } from './api';
import type { GetVectorDocumentsParams } from './types';

export const adminVectorDocsQueryKey = (params: GetVectorDocumentsParams) =>
  ['admin', 'vector-store', 'documents', params] as const;

export const adminVectorDocsQueryOptions = (params: GetVectorDocumentsParams) =>
  queryOptions({
    queryKey: adminVectorDocsQueryKey(params),
    queryFn: () => getVectorDocuments(params),
    placeholderData: keepPreviousData,
  });

export const adminVectorDocQueryKey = (id: string) =>
  ['admin', 'vector-store', 'documents', id] as const;

export const adminVectorDocQueryOptions = (id: string) =>
  queryOptions({
    queryKey: adminVectorDocQueryKey(id),
    queryFn: () => getVectorDocument(id),
    enabled: !!id,
  });

export const adminIngesterTypesQueryKey = () =>
  ['admin', 'ingester-types'] as const;

export const adminIngesterTypesQueryOptions = () =>
  queryOptions({
    queryKey: adminIngesterTypesQueryKey(),
    queryFn: getIngesterTypes,
  });
