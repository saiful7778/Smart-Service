import {
  isDefinedError,
  type CommonORPCErrorCode,
  type ORPCError,
} from "@orpc/client";

export interface FieldError {
  fieldName: string;
  message: string;
}

export interface FormattedError {
  type: "validation" | "general";
  fieldErrors?: FieldError[];
  message: string;
}

type AppORPCError =
  | ORPCError<
      "INPUT_VALIDATION_FAILED",
      { fieldErrors: Record<string, string[]> }
    >
  | ORPCError<CommonORPCErrorCode, undefined>;

function isAppORPCError(error: unknown): error is AppORPCError {
  return isDefinedError(error as AppORPCError);
}

export function formatApiError(error: unknown): FormattedError {
  if (isAppORPCError(error)) {
    if (error.code === "INPUT_VALIDATION_FAILED") {
      const fieldErrors = Object.entries(error.data?.fieldErrors || {}).map(
        ([fieldName, messages]) => ({
          fieldName,
          message:
            Array.isArray(messages) && messages[0]
              ? messages[0]
              : "Input validation error",
        })
      );

      return {
        type: "validation",
        message: "Input validation failed",
        fieldErrors,
      };
    }

    return {
      type: "general",
      message: error.message || "An error occurred",
    };
  }

  if (error instanceof Error) {
    return {
      type: "general",
      message: error.message,
    };
  }

  return {
    type: "general",
    message: "An unexpected error occurred",
  };
}
