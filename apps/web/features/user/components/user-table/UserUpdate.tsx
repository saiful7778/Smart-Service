"use client";

import { useUserTableRowContext } from "../../context/UserTableRowContext";
import {
  Dialog,
  DialogDescription,
  DialogResponsiveBody,
  DialogResponsiveContent,
  DialogStickyHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import UserBannedForm from "../forms/UserBannedForm";
import { useAuthStore } from "@/stores/zustand/auth/AuthStoreContext";
import UserRoleUpdateForm from "../forms/UserRoleUpdateForm";

export default function UserUpdate() {
  "use no memo";
  const { setOpenUpdateDialog, openUpdateDialog, userData } =
    useUserTableRowContext();
  const authUser = useAuthStore((state) => state.user!);

  return (
    <Dialog open={openUpdateDialog} onOpenChange={setOpenUpdateDialog}>
      <DialogResponsiveContent className="w-full sm:max-w-xl">
        <DialogStickyHeader>
          <DialogTitle>Update &quot;{userData.name}&quot;</DialogTitle>
          <DialogDescription>Carefully update user data</DialogDescription>
        </DialogStickyHeader>
        <DialogResponsiveBody>
          <div className="space-y-6">
            <UserBannedForm
              userId={userData.id}
              banned={userData?.banned ?? false}
              banReason={userData?.banReason ?? undefined}
              banExpires={
                userData?.banExpires
                  ? new Date(userData?.banExpires)
                  : undefined
              }
              disabled={authUser.email === userData.email}
            />
            <UserRoleUpdateForm
              userId={userData.id}
              displayRole={userData.displayRole}
              role={userData.role}
            />
          </div>
        </DialogResponsiveBody>
      </DialogResponsiveContent>
    </Dialog>
  );
}
