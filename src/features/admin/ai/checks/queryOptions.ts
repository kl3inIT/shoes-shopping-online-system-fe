import { keepPreviousData, queryOptions } from '@tanstack/react-query';
import { getCheckDefs, getCheckRuns, getCheckResults } from './api';
import type { GetCheckRunsParams } from './types';

export const adminCheckDefsQueryOptions = () =>
  queryOptions({
    queryKey: ['admin', 'checks', 'definitions'] as const,
    queryFn: () => getCheckDefs(),
  });

export const adminCheckRunsQueryOptions = (params: {
  page: number;
  size: number;
}) =>
  queryOptions({
    queryKey: ['admin', 'checks', 'runs', params] as const,
    queryFn: () => getCheckRuns(params),
    placeholderData: keepPreviousData,
  });

export const adminCheckResultsQueryOptions = (runId: string) =>
  queryOptions({
    queryKey: ['admin', 'checks', 'runs', runId, 'results'] as const,
    queryFn: () => getCheckResults(runId),
    enabled: !!runId,
  });
