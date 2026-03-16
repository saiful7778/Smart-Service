import { faker } from "@faker-js/faker";
import { hashPassword } from "better-auth/crypto";

import {
  AccountTable,
  InsertAccount,
  InsertUser,
  UserDataModel,
  UserTable,
} from "../schemas";
import { UserRoleEnumSchema } from "../schemas/enums/zod-enums";
import { db } from "./seed-db-client";
import { seedConfigs } from "./seed.config";

const DEFAULT_USERS = [
  {
    name: "John User",
    email: "user@mail.com",
    role: UserRoleEnumSchema.enum.USER,
    seed: "user",
  },
  {
    name: "Admin Smith",
    email: "admin@mail.com",
    role: UserRoleEnumSchema.enum.ADMIN,
    seed: "admin",
  },
  {
    name: "Super Admin",
    email: "superadmin@mail.com",
    role: UserRoleEnumSchema.enum.SUPER_ADMIN,
    seed: "superadmin",
  },
];

const DEFAULT_PASSWORD = "12345678";

export async function seedUsers(): Promise<UserDataModel[]> {
  console.log("🌱 Seeding users...");

  const remaining = Math.max(
    0,
    seedConfigs.targets.users - DEFAULT_USERS.length
  );

  const usersData: InsertUser[] = DEFAULT_USERS.map(
    (u) =>
      ({
        name: u.name,
        email: u.email,
        role: u.role,
        emailVerified: true,
        image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.seed}`,
        banned: false,
      }) as InsertUser
  );

  for (let i = 0; i < remaining; i++) {
    usersData.push({
      name: faker.person.fullName(),
      email: `seed.user.${i}@example.com`,
      role: faker.helpers.arrayElement(UserRoleEnumSchema.options),
      emailVerified: faker.datatype.boolean(),
      image: faker.image.avatar(),
      banned: faker.datatype.boolean(0.05),
    });
  }

  const hashedPassword = await hashPassword(DEFAULT_PASSWORD);

  const users = await db.insert(UserTable).values(usersData).returning();

  const accountsData: InsertAccount[] = users.map(
    (u) =>
      ({
        accountId: faker.string.uuid(),
        providerId: "credential",
        password: hashedPassword,
        userId: u.id,
      }) as InsertAccount
  );

  await db.insert(AccountTable).values(accountsData);

  console.log(`✅ ${users.length} Users seeded`);
  return users;
}
