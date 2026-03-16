import { router } from "./orpc.router";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { SmartCoercionPlugin } from "@orpc/json-schema";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import {
  CORSPlugin,
  SimpleCsrfProtectionHandlerPlugin,
} from "@orpc/server/plugins";
import pkg from "../package.json";
import { env } from "@/configs/env.config";
import { CompressionPlugin, RPCHandler } from "@orpc/server/fetch";

export const openAPIHandler = new OpenAPIHandler(router, {
  plugins: [
    new CORSPlugin(),
    new SimpleCsrfProtectionHandlerPlugin(),
    new SmartCoercionPlugin({
      schemaConverters: [new ZodToJsonSchemaConverter()],
    }),
    new CompressionPlugin(),
    new OpenAPIReferencePlugin({
      docsProvider: "scalar",
      schemaConverters: [new ZodToJsonSchemaConverter()],
      specGenerateOptions: {
        info: {
          title: env.NEXT_PUBLIC_SITE_NAME,
          version: pkg.version,
        },

        security: [{ bearerAuth: [] }],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
            },
          },
        },
      },
      docsConfig: {
        authentication: {
          securitySchemes: {
            bearerAuth: {
              token: "default-token",
            },
          },
        },
      },
    }),
  ],
});

export const rpcHandler = new RPCHandler(router, {
  plugins: [
    new CORSPlugin(),
    new SimpleCsrfProtectionHandlerPlugin(),
    new SmartCoercionPlugin({
      schemaConverters: [new ZodToJsonSchemaConverter()],
    }),
    new CompressionPlugin(),
  ],
});
