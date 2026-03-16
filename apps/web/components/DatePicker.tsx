"use client";

import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { format, setMonth, setYear } from "date-fns";
import { Button, ButtonProps } from "@workspace/ui/components/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { cn } from "@workspace/ui/lib/utils";
import { Calendar, CalenderProps } from "@workspace/ui/components/calendar";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@workspace/ui/components/drawer";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { useIsMobile } from "@workspace/ui/hooks/use-mobile";

interface DatePickerProps {
  value?: Date;
  onSelectValue: (value: Date | undefined) => void;
  calenderDisable?: CalenderProps["disabled"];
  inputVariant?: ButtonProps["variant"];
  placeholder?: string;
  triggerClassName?: string;
  fromYear?: number;
  toYear?: number;
  disabled?: boolean | undefined;
}

export default function DatePicker({
  calenderDisable,
  onSelectValue,
  value = new Date(),
  inputVariant,
  placeholder,
  triggerClassName,
  fromYear = 2000,
  toYear = 2050,
  disabled = false,
}: DatePickerProps) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  return isMobile ? (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <TriggerButton
          value={value}
          variant={inputVariant}
          placeholder={placeholder}
          className={triggerClassName}
          disabled={disabled}
          aria-disabled={disabled}
        />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Select a Date</DrawerTitle>
          <DrawerDescription>
            By default user will banned 10 days
          </DrawerDescription>
        </DrawerHeader>
        <div className="border-t">
          <CalenderComponent
            value={value}
            onSelectValue={onSelectValue}
            setOpen={setOpen}
            calenderDisable={calenderDisable}
            fromYear={fromYear}
            toYear={toYear}
          />
        </div>
      </DrawerContent>
    </Drawer>
  ) : (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <TriggerButton
            value={value}
            variant={inputVariant}
            placeholder={placeholder}
            className={triggerClassName}
            disabled={disabled}
            aria-disabled={disabled}
          />
        }
      >
        Open datepicker
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <CalenderComponent
          value={value}
          onSelectValue={onSelectValue}
          setOpen={setOpen}
          calenderDisable={calenderDisable}
          fromYear={fromYear}
          toYear={toYear}
        />
      </PopoverContent>
    </Popover>
  );
}

interface TriggerButtonProps extends Omit<ButtonProps, "value"> {
  value: Date;
  placeholder?: string;
}

function TriggerButton({
  value,
  className,
  placeholder,
  variant,
  ...props
}: TriggerButtonProps) {
  return (
    <Button
      variant={variant ?? "outline"}
      className={cn(
        "pl-3 text-left font-normal",
        !value && "text-muted-foreground",
        className
      )}
      type="button"
      {...props}
    >
      {value ? (
        <span>{format(value, "PPP")}</span>
      ) : (
        <span>{placeholder ?? "Pick a date"}</span>
      )}
      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
    </Button>
  );
}

function CalenderComponent({
  value,
  onSelectValue,
  fromYear = 2000,
  toYear = 2050,
  calenderDisable,
  setOpen,
}: {
  value: Date;
  onSelectValue: (value: Date | undefined) => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  fromYear?: number;
  toYear?: number;
  calenderDisable?: CalenderProps["disabled"];
}) {
  const [month, setMonthChange] = useState<Date>(value);

  const handleSelect = (selectedValue: Date | undefined) => {
    onSelectValue(selectedValue);
    setOpen(false);
  };

  const handleMonthChange = (monthIndex: string | null) => {
    if (!monthIndex) return;
    const updateValue = setMonth(value, Number(monthIndex));
    setMonthChange(updateValue);
    onSelectValue(updateValue);
  };

  const handleYearChange = (year: string | null) => {
    if (!year) return;
    const updateValue = setYear(value, Number(year));
    setMonthChange(updateValue);
    onSelectValue(updateValue);
  };

  return (
    <div>
      <div className="flex items-center justify-center gap-2 border-b py-2">
        <SelectMonth value={value} handleMonthChange={handleMonthChange} />
        <SelectYear
          fromYear={fromYear}
          toYear={toYear}
          value={value}
          handleYearChange={handleYearChange}
        />
      </div>
      <div className="flex justify-center">
        <Calendar
          mode="single"
          selected={value}
          month={month}
          onMonthChange={setMonthChange}
          onSelect={handleSelect}
          disabled={calenderDisable}
        />
      </div>
    </div>
  );
}

function SelectMonth({
  value,
  handleMonthChange,
}: {
  value: Date;
  handleMonthChange: (monthIndex: string | null) => void;
}) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const items = months.map((monthName, index) => ({
    value: index.toString(),
    label: monthName,
  }));

  return (
    <Select
      items={items}
      value={value?.getMonth().toString()}
      onValueChange={handleMonthChange}
    >
      <SelectTrigger size="sm">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {items.map(({ value, label }) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function SelectYear({
  toYear = 2050,
  fromYear = 2000,
  value,
  handleYearChange,
}: {
  toYear?: number;
  fromYear?: number;
  value: Date;
  handleYearChange: (year: string | null) => void;
}) {
  const years = Array.from(
    { length: toYear - fromYear + 1 },
    (_, i) => fromYear + i
  );

  const items = years.map((year) => ({
    value: year.toString(),
    label: year.toString(),
  }));

  return (
    <Select
      items={items}
      value={value?.getFullYear().toString()}
      onValueChange={handleYearChange}
    >
      <SelectTrigger size="sm">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {items.map(({ label, value }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
