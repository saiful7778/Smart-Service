"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { userUpdateSchema, type UserUpdateType } from "../../user.schema";
import {
  UserRoleEnumSchema,
  type UserRoleEnumType,
} from "@workspace/drizzle/client-enums";
import { FieldGroup } from "@workspace/ui/components/field";
import { InputField } from "@workspace/ui/components/form-fields/InputField";
import { Button } from "@workspace/ui/components/button";
import { Spinner } from "@workspace/ui/components/spinner";
import { SelectField } from "@workspace/ui/components/form-fields/SelectField";
import { useUserUpdate } from "../../api/users.api.hook";
import toast from "react-hot-toast";
import { formatEnumValue } from "@workspace/lib";
import { useUserTableRowContext } from "../../context/UserTableRowContext";

export default function UserRoleUpdateForm({
  userId,
  displayRole = "",
  role,
}: {
  userId: string;
  displayRole?: string | null | undefined;
  role: UserRoleEnumType;
}) {
  "use no memo";
  const { setOpenUpdateDialog } = useUserTableRowContext();
  const toastId = "user_update_toast_message";

  const form = useForm<UserUpdateType>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      displayRole,
      role,
    },
  });

  const { mutate, isPending } = useUserUpdate({
    onRequest: () => {
      toast.loading("Loading...", { id: toastId });
    },
    onSuccess: (message) => {
      toast.success(message, { id: toastId });
      setOpenUpdateDialog(false);
    },
    onValidationErrors: (fields) => {
      fields.forEach((field) => {
        form.setError(field.fieldName as keyof UserUpdateType, {
          message: field.message,
        });
      });
    },
    onError: (errorMessage) => {
      toast.error(errorMessage, { id: toastId });
    },
  });

  const handleSubmit = async (e: UserUpdateType) => {
    mutate({
      ...e,
      userId,
    });
  };

  return (
    <div className="rounded-md border p-3 pt-0 shadow">
      <h5 className="-mt-3 w-fit bg-background px-2 text-sm font-medium">
        Role update
      </h5>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-2">
        <FieldGroup>
          <InputField
            control={form.control}
            name="displayRole"
            placeholder="Display role"
            disabled={isPending}
          />
          <SelectField
            control={form.control}
            name="role"
            placeholder="User Role"
            selectValues={UserRoleEnumSchema.options.map((value) => ({
              value,
              label: formatEnumValue(value),
            }))}
            disabled={isPending}
          />
          <div className="text-right">
            <Button
              disabled={!form.formState.isDirty || isPending}
              aria-disabled={!form.formState.isDirty || isPending}
              type="submit"
            >
              {isPending ? <Spinner /> : "Submit"}
            </Button>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
}
