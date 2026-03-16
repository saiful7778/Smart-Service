import { type NextRequest } from "next/server";

import { onError, ORPCError, os, ValidationError } from "@orpc/server";
import z from "zod";

import { type DatabaseType } from "@workspace/drizzle";

import { API_MESSAGES } from "@/constant/apiMessage";

export interface ORPCContext {
  reqHeaders: Readonly<NextRequest["headers"]>;
  db: Readonly<DatabaseType>;
}

export const baseOs = os.$context<ORPCContext>().errors({
  UNAUTHORIZED: {
    status: 401,
    message: API_MESSAGES.GENERAL.UNAUTHORIZED,
  },
  FORBIDDEN: {
    status: 403,
    message: API_MESSAGES.GENERAL.FORBIDDEN,
  },
  BAD_REQUEST: {
    status: 400,
    message: API_MESSAGES.GENERAL.BAD_REQUEST,
  },
  INPUT_VALIDATION_FAILED: {
    status: 422,
    message: API_MESSAGES.GENERAL.INPUT_VALIDATION_FAILED,
    data: z.object({
      formErrors: z.array(z.string()),
      fieldErrors: z.record(z.string(), z.array(z.string()).optional()),
    }),
  },
});

const errorMiddleware = baseOs.middleware(
  onError((error) => {
    if (
      error instanceof ORPCError &&
      error.code === "BAD_REQUEST" &&
      error.cause instanceof ValidationError
    ) {
      // If you only use Zod you can safely cast to ZodIssue[]
      const zodError = new z.ZodError(error.cause.issues as z.core.$ZodIssue[]);

      throw new ORPCError("INPUT_VALIDATION_FAILED", {
        status: 422,
        message: z.prettifyError(zodError),
        data: z.flattenError(zodError),
        cause: error.cause,
      });
    }

    if (
      error instanceof ORPCError &&
      error.code === "INTERNAL_SERVER_ERROR" &&
      error.cause instanceof ValidationError
    ) {
      throw new ORPCError("OUTPUT_VALIDATION_FAILED", {
        message: error.message,
        cause: error.cause,
      });
    }
  })
);

export const publicOs = baseOs.use(errorMiddleware);
