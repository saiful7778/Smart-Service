import { env } from "@/configs/env.config";
import { AuthUser } from "@/types";
import { Session } from "better-auth";
import { createStore } from "zustand";
import { combine, devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export interface AuthStoreState {
  user: AuthUser | undefined;
  session: Session | undefined;
}

export interface AuthStoreAction {
  addUserData: (userData: AuthUser) => void;
  clearAllData: () => void;
}

export function authStore(
  userData: AuthUser | undefined,
  sessionData: Session | undefined
) {
  return createStore<AuthStoreState & AuthStoreAction>()(
    devtools(
      immer(
        combine<AuthStoreState, AuthStoreAction>(
          {
            user: userData,
            session: sessionData,
          },
          (set) => ({
            addUserData: (userData) => {
              set((state) => {
                state.user = userData;
                return state;
              });
            },
            clearAllData: () => {
              set((state) => {
                state.user = undefined;
                state.session = undefined;
                return state;
              });
            },
          })
        )
      ),

      {
        name: "auth-store",
        store: "auth-store",
        enabled: env.NEXT_PUBLIC_NODE_ENV === "development",
      }
    )
  );
}
