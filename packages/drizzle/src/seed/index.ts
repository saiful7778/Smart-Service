import { clearAll } from "../utils/clearAll";
import { db } from "./seed-db-client";
import { seedUsers } from "./user.seed";

async function main() {
  console.log("🌱 Starting database seed...\n");
  await clearAll(db);

  // Seed data
  const users = await seedUsers();

  console.log("\n📊 Seed Summary:");
  console.log(`Users: ${users.length}`);

  console.log("\n🎉 Seed completed successfully!");
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  });
