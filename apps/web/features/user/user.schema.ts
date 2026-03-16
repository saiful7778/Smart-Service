import { UserRoleEnumSchema } from "@workspace/drizzle/client-enums";
import z from "zod";

export const userBannedSchema = z.object({
  banned: z.boolean().optional(),
  banReason: z.string().optional(),
  banExpires: z.date().optional(),
});
export type UserBannedType = z.infer<typeof userBannedSchema>;

export const userUpdateSchema = z.object({
  displayRole: z.string().nullable(),
  role: UserRoleEnumSchema,
});
export type UserUpdateType = z.infer<typeof userUpdateSchema>;
