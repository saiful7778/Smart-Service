import { db } from "@/lib/db";
import { type InsertUserActivity, UserActivityTable } from "@workspace/drizzle";

export async function createUserActivity(value: InsertUserActivity) {
  return await db.insert(UserActivityTable).values({
    loginAt: new Date(),
    lastSeenAt: new Date(),
    ...value,
  });
}
