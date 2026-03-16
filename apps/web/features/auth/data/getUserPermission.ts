import { cache } from "react";

import { LiteralString } from "better-auth";
import "server-only";

import { auth } from "@/lib/better-auth/auth";

export const getUserPermission = cache(
  async (
    userId: string,
    permissions: {
      readonly [x: string]: LiteralString[] | undefined;
    }
  ) => {
    return auth.api.userHasPermission({
      body: {
        userId,
        permissions,
      },
    });
  }
);
