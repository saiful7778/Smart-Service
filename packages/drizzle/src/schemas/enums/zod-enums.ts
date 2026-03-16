import z from "zod";
import { USER_EVENT_CATEGORY, USER_ROLES } from "./enum-values";

export const UserRoleEnumSchema = z.enum(USER_ROLES);
export type UserRoleEnumType = z.infer<typeof UserRoleEnumSchema>;

export const UserEventCategoryEnumSchema = z.enum(USER_EVENT_CATEGORY);
export type UserEventCategoryEnumType = z.infer<
  typeof UserEventCategoryEnumSchema
>;
