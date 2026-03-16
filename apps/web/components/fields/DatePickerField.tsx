import { Info } from "lucide-react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

import { ButtonProps } from "@workspace/ui/components/button";
import { CalenderProps } from "@workspace/ui/components/calendar";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@workspace/ui/components/field";

import DatePicker from "../DatePicker";

interface DatePickerFieldProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  label?: string;
  description?: string;
  isDescriptionInfoIconShow?: boolean;
  requiredField?: boolean;
  placeholder?: string;
  inputVariant?: ButtonProps["variant"];
  disabled?: boolean;
  triggerClassName?: string;
  calenderDisable?: CalenderProps["disabled"];
}

export default function DatePickerField<TFieldValues extends FieldValues>({
  name,
  control,
  label,
  description,
  isDescriptionInfoIconShow = false,
  requiredField = false,
  disabled,
  inputVariant,
  triggerClassName,
  placeholder,
  calenderDisable,
}: DatePickerFieldProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field className="flex flex-col" data-invalid={fieldState.invalid}>
          {label && (
            <FieldLabel aria-disabled={disabled}>
              {label}
              {requiredField && <span className="text-destructive">*</span>}
            </FieldLabel>
          )}
          <DatePicker
            value={field.value ?? new Date()}
            onSelectValue={field.onChange}
            calenderDisable={calenderDisable}
            inputVariant={inputVariant}
            placeholder={placeholder}
            triggerClassName={triggerClassName}
            disabled={disabled}
          />
          {description && (
            <FieldDescription
              className="flex items-start gap-1.5"
              aria-disabled={disabled}
            >
              {isDescriptionInfoIconShow && <Info className="mt-0.5 size-4" />}
              {description}
            </FieldDescription>
          )}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
