import { type InsertUserEvent, UserEventTable } from "@workspace/drizzle";

import { db } from "@/lib/db";

export async function createUserEvent(value: InsertUserEvent) {
  return await db.insert(UserEventTable).values(value);
}
