import z from "zod";

export function apiOutput<T extends z.ZodObject<z.ZodRawShape> | z.ZodNull>(
  schema: T
): z.ZodObject<{
  message: z.ZodString;
  data: T;
}> {
  return z.object({
    message: z.string(),
    data: schema,
  });
}
