import React from "react";
import ms from "ms";

import {
  useMutation,
  useQuery,
  type QueryFunction,
  type QueryKey,
  type SkipToken,
  type MutationFunction,
} from "@tanstack/react-query";

function queryData<
  TQueryFnData = unknown,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = never,
>(
  queryKey: TQueryKey,
  queryFn: QueryFunction<TQueryFnData, TQueryKey, TPageParam> | SkipToken,
) {
  const query = useQuery({
    queryKey,
    queryFn,
    staleTime: ms("1Day"),
    gcTime: ms("1Day"),
    enabled: true,
  });

  return query;
}

function mutateData<TData = unknown, TVariables = void, TContext = unknown>(
  mutationFn: MutationFunction<TData, TVariables>,
  onSuccess: (
    data: TData,
    variables: TVariables,
    context: TContext,
  ) => Promise<unknown> | unknown,
) {
  const mutation = useMutation({
    mutationFn,
    onSuccess,
  });

  return mutation;
}

export { queryData, mutateData };
