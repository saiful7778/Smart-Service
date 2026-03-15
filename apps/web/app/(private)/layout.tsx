import { getAuthUser } from "@/features/auth/data/getAuthUser";
import { AuthStoreProvider } from "@/stores/zustand/auth/AuthStoreContext";

export default async function PrivateLayout({ children }: LayoutProps<"/">) {
  const { session, user } = await getAuthUser();

  return (
    <AuthStoreProvider user={user} session={session}>
      {children}
    </AuthStoreProvider>
  );
}
