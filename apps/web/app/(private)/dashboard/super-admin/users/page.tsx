import { Metadata } from "next";
import { redirect } from "next/navigation";

import { tableQuerySearchParams } from "@/lib/nuqs/tableQuerySearchParams";
import { getQueryClient, HydrateClient } from "@/lib/tanstack/query/hydration";

import { DEFAULT_AUTH_PATH } from "@/constant";
import { getAuthUser } from "@/features/auth/data/getAuthUser";
import { getUserPermission } from "@/features/auth/data/getUserPermission";
import UserManagementTable from "@/features/user/components/UserManagementTable";
import UserStats from "@/features/user/components/UserStats";
import { orpcTQClient } from "@/server/orpc.client";

export const metadata: Metadata = {
  title: "User management",
};

export default async function UsersPage(
  props: PageProps<"/dashboard/super-admin/users">
) {
  const { user } = await getAuthUser();
  const { limit, page, search, order, orderField } =
    await tableQuerySearchParams(props.searchParams);

  const searchFields = ["name", "email"];

  const { success } = await getUserPermission(user.id, { user: ["list"] });

  if (!success) {
    return redirect(DEFAULT_AUTH_PATH);
  }

  const queryclient = getQueryClient();

  await queryclient.prefetchQuery(
    orpcTQClient.user.list.queryOptions({
      input: {
        page,
        limit,
        search,
        searchFields,
        order: order ?? undefined,
        orderField: orderField ?? undefined,
      },
    })
  );

  await queryclient.prefetchQuery(orpcTQClient.user.stats.queryOptions());

  return (
    <HydrateClient client={queryclient}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">User Management</h1>
        <UserStats />
        <UserManagementTable
          page={page}
          limit={limit}
          search={search}
          searchFields={searchFields}
        />
      </div>
    </HydrateClient>
  );
}
