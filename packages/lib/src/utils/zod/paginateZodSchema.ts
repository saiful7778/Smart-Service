import z from "zod"
import { fieldValidatorZodSchema } from "./fieldValidatorZodSchema"

type ExtractObjectKeys<T> =
  T extends z.ZodObject<infer Shape> ? Extract<keyof Shape, string> : never

export function paginateSchema<TModel extends z.ZodObject<z.ZodRawShape>>({
  orderFields,
  filter,
  searchFields,
}: {
  filter?: z.ZodObject<z.ZodRawShape>
  orderFields?: ReadonlyArray<ExtractObjectKeys<TModel>>
  searchFields?: ReadonlyArray<ExtractObjectKeys<TModel>>
}) {
  const base = z.object({
    page: z.number().int().min(1).default(1).optional(),
    limit: z.number().int().min(1).default(20).optional(),
    order: z.enum(["asc", "desc"] as const).optional(),
    orderField: z
      .enum(orderFields as unknown as [string, ...string[]])
      .optional(),
    search: z.string().trim().toLowerCase().optional(),
    searchFields: fieldValidatorZodSchema("searchFields", searchFields),
    filter: filter ? filter.optional() : z.object({}).optional(),
  })

  return base
}
