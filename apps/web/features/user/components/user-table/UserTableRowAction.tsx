"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import UserDelete from "./UserDelete";
import UserUpdate from "./UserUpdate";
import { Button } from "@workspace/ui/components/button";
import { EllipsisVertical, Pencil, Trash2 } from "lucide-react";
import { useAuthStore } from "@/stores/zustand/auth/AuthStoreContext";
import { useUserTableRowContext } from "../../context/UserTableRowContext";

export default function UserTableRowAction() {
  "use no memo";
  const authUser = useAuthStore((state) => state.user!);
  const { setOpenDeleteDialog, setOpenUpdateDialog, userData } =
    useUserTableRowContext();

  return (
    <>
      <UserUpdate />
      <UserDelete />

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button size="icon-sm" variant="outline">
              <EllipsisVertical />
            </Button>
          }
        />
        <DropdownMenuContent className="w-40" align="start">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Manage User</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setOpenUpdateDialog(true)}>
              <Pencil />
              <span>Update user</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              disabled={authUser.email === userData.email}
              onClick={() => setOpenDeleteDialog(true)}
              variant="destructive"
            >
              <Trash2 />
              <span>Delete User</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
