import { pgEnum } from "drizzle-orm/pg-core";
import { USER_EVENT_CATEGORY, USER_ROLES } from "./enum-values";

export const UserRoleEnum = pgEnum("UserRoleEnum", USER_ROLES);

export const UserEventCategoryEnum = pgEnum(
  "UserEventCategoryEnum",
  USER_EVENT_CATEGORY
);
