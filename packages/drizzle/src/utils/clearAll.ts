import { DatabaseType } from "../drizzle-client";
import {
  AccountTable,
  SessionTable,
  UserTable,
  VerificationTable,
} from "../schemas";

export async function clearAll(db: DatabaseType) {
  console.log("🧹 Clearing existing data...");
  await db.transaction(async (tx) => {
    await tx.delete(AccountTable);
    await tx.delete(SessionTable);
    await tx.delete(VerificationTable);
    await tx.delete(UserTable);
  });
  console.log("🗑️  Cleared existing data \n");
}
