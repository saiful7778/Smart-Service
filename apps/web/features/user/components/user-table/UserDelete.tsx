"use client";

import { CircleAlertIcon } from "lucide-react";
import { useState } from "react";
import { useUserTableRowContext } from "../../context/UserTableRowContext";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { useUserDelete } from "../../api/users.api.hook";
import toast from "react-hot-toast";

export default function UserDelete() {
  const [inputValue, setInputValue] = useState("");
  const toastId = "user_delete_toast_message";

  const { userData, openDeleteDialog, setOpenDeleteDialog } =
    useUserTableRowContext();

  const { mutate, isPending } = useUserDelete({
    onRequest: () => {
      toast.loading("Loading...", { id: toastId });
    },
    onSuccess: (message) => {
      toast.success(message, { id: toastId });
      setOpenDeleteDialog(false);
    },
    onError: (errorMessage) => {
      toast.error(errorMessage, { id: toastId });
    },
  });

  return (
    <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
      <AlertDialogContent>
        <div className="flex flex-col items-center gap-2">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <CircleAlertIcon className="opacity-80" size={16} />
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle className="sm:text-center">
              Final confirmation
            </AlertDialogTitle>
            <AlertDialogDescription className="sm:text-center">
              This action cannot be undone. Are you sure to delete{" "}
              <span className="font-semibold text-foreground">
                {userData.name}
              </span>{" "}
              user. To confirm, please enter{" "}
              <span className="font-semibold text-foreground">CONFIRM</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>

        <div className="space-y-5">
          <div className="*:not-first:mt-2">
            <Input
              type="text"
              placeholder="Type CONFIRM"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel
              render={
                <Button type="button" variant="outline" className="flex-1">
                  Cancel
                </Button>
              }
            />
            <Button
              type="button"
              className="flex-1"
              disabled={isPending || inputValue !== "CONFIRM"}
              aria-disabled={isPending || inputValue !== "CONFIRM"}
              onClick={() => {
                mutate({ userId: userData.id });
              }}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
