"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orpcTQClient } from "@/server/orpc.client";
import { IApiHookInput } from "@/types";
import { formatApiError } from "@/lib/formatApiError";

export function useBanUnbannedUser({
  onSuccess,
  onRequest,
  onError,
  onValidationErrors,
}: IApiHookInput) {
  const queryClient = useQueryClient();
  return useMutation(
    orpcTQClient.user.ban.mutationOptions({
      onMutate: () => {
        onRequest?.();
      },
      onSuccess: async ({ message }) => {
        await queryClient.invalidateQueries({
          queryKey: orpcTQClient.user.list.queryKey({
            input: {},
          }),
          exact: false,
        });
        onSuccess?.(message);
      },
      onError: (error) => {
        const { message, type, fieldErrors } = formatApiError(error);

        if (type === "validation") {
          onValidationErrors?.(fieldErrors ?? []);
        }

        onError?.(message);
      },
    })
  );
}

export function useUserUpdate({
  onRequest,
  onSuccess,
  onError,
  onValidationErrors,
}: IApiHookInput) {
  const queryClient = useQueryClient();

  return useMutation(
    orpcTQClient.user.update.mutationOptions({
      onMutate: () => {
        onRequest?.();
      },
      onSuccess: async ({ message }) => {
        await queryClient.invalidateQueries({
          queryKey: orpcTQClient.user.list.queryKey({
            input: {},
          }),
          exact: false,
        });
        onSuccess?.(message);
      },
      onError: (error) => {
        const { message, type, fieldErrors } = formatApiError(error);

        if (type === "validation") {
          onValidationErrors?.(fieldErrors ?? []);
        }

        onError?.(message);
      },
    })
  );
}

export function useUserDelete({
  onRequest,
  onSuccess,
  onError,
}: IApiHookInput) {
  const queryClient = useQueryClient();
  return useMutation(
    orpcTQClient.user.delete.mutationOptions({
      onMutate: () => {
        onRequest?.();
      },
      onSuccess: async ({ message }) => {
        await queryClient.invalidateQueries({
          queryKey: orpcTQClient.user.list.queryKey({
            input: {},
          }),
        });
        await queryClient.invalidateQueries({
          queryKey: orpcTQClient.user.stats.queryKey(),
        });
        onSuccess?.(message);
      },
      onError: (error) => {
        const { message } = formatApiError(error);

        onError?.(message);
      },
    })
  );
}
