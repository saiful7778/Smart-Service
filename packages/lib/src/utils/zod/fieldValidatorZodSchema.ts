import z from "zod";

export function fieldValidatorZodSchema<
  TKey extends "searchFields",
  TAllowed extends string,
>(
  key: TKey,
  allowedFields?: readonly TAllowed[]
): z.ZodOptional<z.ZodArray<z.ZodString>> {
  const hasRestrictions =
    Array.isArray(allowedFields) && allowedFields.length > 0;

  return z
    .array(z.string())
    .refine(
      (values) => {
        if (!hasRestrictions || !values) return true;
        return values.every((value) =>
          allowedFields.includes(value as TAllowed)
        );
      },
      {
        message: hasRestrictions
          ? `Each value in '${key}' must be one of: ${allowedFields
              .map((f) => `"${f}"`)
              .join(", ")}`
          : `Each value in '${key}' must be one of: <no allowed fields provided>`,
      }
    )
    .optional();
}
