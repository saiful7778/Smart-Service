import { db } from "@/lib/db";
import { type InsertUserEvent, UserEventTable } from "@workspace/drizzle";

export async function createUserEvent(value: InsertUserEvent) {
  return await db.insert(UserEventTable).values(value);
}
