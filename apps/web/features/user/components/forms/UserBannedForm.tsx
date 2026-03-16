import { Controller, useForm } from "react-hook-form";
import { userBannedSchema, UserBannedType } from "../../user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserTableRowContext } from "../../context/UserTableRowContext";
import DatePickerField from "@/components/fields/DatePickerField";
import { Switch } from "@workspace/ui/components/switch";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field";
import { InputField } from "@workspace/ui/components/form-fields/InputField";
import { Button } from "@workspace/ui/components/button";
import { Spinner } from "@workspace/ui/components/spinner";
import { useBanUnbannedUser } from "../../api/users.api.hook";
import toast from "react-hot-toast";

interface UserBannedFormProps {
  userId: string;
  banned?: boolean | undefined;
  banReason?: string | undefined;
  banExpires?: Date | undefined;
  disabled?: boolean | undefined;
}

export default function UserBannedForm({
  userId,
  banned,
  banReason,
  banExpires,
  disabled = false,
}: UserBannedFormProps) {
  "use no memo";
  const { setOpenUpdateDialog } = useUserTableRowContext();
  const toastId = "user_banned_toast_message";

  const { mutate, isPending } = useBanUnbannedUser({
    onRequest: () => {
      toast.loading("Loading...", { id: toastId });
    },
    onSuccess: (message) => {
      toast.success(message, { id: toastId });
      setOpenUpdateDialog(false);
    },
    onValidationErrors: (fields) => {
      fields.forEach((field) => {
        form.setError(field.fieldName as keyof UserBannedType, {
          message: field.message,
        });
      });
    },
    onError: (message) => {
      toast.error(message, { id: toastId });
    },
  });

  const form = useForm<UserBannedType>({
    resolver: zodResolver(userBannedSchema),
    defaultValues: {
      banned,
      banReason: banReason ?? "",
      banExpires,
    },
    disabled,
  });

  const handleSubmit = async (e: UserBannedType) => {
    mutate({ ...e, userId });
  };

  const isBanned = form.watch("banned");

  return (
    <div className="rounded-md border p-3 pt-0 shadow">
      <h5 className="-mt-3 w-fit bg-background px-2 text-sm font-medium">
        Banned Settings
      </h5>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-2">
        <FieldGroup>
          <Controller
            control={form.control}
            name="banned"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState}>
                <div className="flex h-10 flex-row items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-base selection:bg-primary dark:bg-input/30">
                  <FieldLabel
                    htmlFor="banned"
                    aria-disabled={disabled || isPending}
                  >
                    Banned
                  </FieldLabel>
                  <div className="flex w-auto items-center justify-end">
                    <Switch
                      id="banned"
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        if (!checked) {
                          form.setValue("banReason", undefined);
                          form.setValue("banExpires", undefined);
                        }
                      }}
                      disabled={disabled || isPending}
                      aria-disabled={disabled || isPending}
                    />
                  </div>
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          {isBanned && (
            <>
              <InputField
                control={form.control}
                name="banReason"
                placeholder="Banned Reason"
                disabled={disabled || isPending}
              />
              <DatePickerField
                control={form.control}
                name="banExpires"
                placeholder="Banned Expires"
                calenderDisable={(date) =>
                  date.getTime() < Date.now() + 1000 * 60 * 60 * 24 * 10 ||
                  date.getTime() < new Date("1900-01-01").getTime()
                }
                disabled={disabled || isPending}
              />
            </>
          )}
          <div className="text-right">
            <Button
              disabled={disabled || !form.formState.isDirty || isPending}
              aria-disabled={disabled || !form.formState.isDirty || isPending}
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
