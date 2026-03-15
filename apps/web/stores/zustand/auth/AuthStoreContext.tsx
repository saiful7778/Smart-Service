"use client";

import { createContext, useContext, useState } from "react";
import { authStore, AuthStoreAction, AuthStoreState } from "./authStore";
import { StoreApi, useStore } from "zustand";
import { AuthUser } from "@/types";
import { Session } from "better-auth";

const AuthStoreContext = createContext<StoreApi<
  AuthStoreState & AuthStoreAction
> | null>(null);

interface AuthStoreProviderProps extends React.PropsWithChildren {
  user?: AuthUser | undefined;
  session?: Session | undefined;
}

export function AuthStoreProvider({
  children,
  user,
  session,
}: AuthStoreProviderProps) {
  const [store] = useState<StoreApi<AuthStoreState & AuthStoreAction>>(() =>
    authStore(user, session)
  );

  return (
    <AuthStoreContext.Provider value={store}>
      {children}
    </AuthStoreContext.Provider>
  );
}

export function useAuthStore<T>(
  selector: (state: AuthStoreState & AuthStoreAction) => T
) {
  const store = useContext(AuthStoreContext);
  if (!store) {
    throw new Error("AuthStoreProvider is not found");
  }
  return useStore(store, selector);
}
