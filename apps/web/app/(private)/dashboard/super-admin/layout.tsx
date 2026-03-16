import { redirect } from "next/navigation";

import { UserRoleEnumSchema } from "@workspace/drizzle/client-enums";

import { DEFAULT_AUTH_PATH } from "@/constant";
import { getAuthUser } from "@/features/auth/data/getAuthUser";

export default async function SuperAdminLayout({
  children,
}: LayoutProps<"/dashboard/super-admin">) {
  const { user } = await getAuthUser();

  if (user.role !== UserRoleEnumSchema.enum.SUPER_ADMIN) {
    return redirect(DEFAULT_AUTH_PATH);
  }

  return children;
}
