"use client";

import type { Column } from "@tanstack/react-table";
import { CalendarIcon, XCircle } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { Calendar } from "@workspace/ui/components/calendar";
import { format } from "date-fns";
import { Separator } from "@workspace/ui/components/separator";
import { Button } from "@workspace/ui/components/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { useCallback, useMemo } from "react";

/* ------------------------------------
   Type Guards & Utilities
------------------------------------- */

function isDateRange(value: unknown): value is DateRange {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    "from" in value &&
    "to" in value
  );
}

/** Always return ONLY (number | undefined)[] */
function parseFilterValue(value: unknown): (number | undefined)[] {
  if (value == null) return [];

  if (Array.isArray(value)) {
    return value.map((v) => {
      if (typeof v === "number") return v;
      if (typeof v === "string") {
        const parsed = Number(v);
        return Number.isNaN(parsed) ? undefined : parsed;
      }
      return undefined;
    });
  }

  if (typeof value === "number") return [value];
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? [undefined] : [parsed];
  }

  return [];
}

function toDate(ts: number | undefined): Date | undefined {
  if (ts == null) return undefined;
  const d = new Date(ts);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

function safeFormat(date: Date | undefined): string {
  return date ? format(date, "MMM dd, yy") : "";
}

/* ------------------------------------
   Component
------------------------------------- */

interface DataTableDateFilterProps<TData> {
  column: Column<TData, unknown>;
  title?: string;
  multiple?: boolean;
}

export function DataTableDateFilter<TData>({
  column,
  title,
  multiple,
}: DataTableDateFilterProps<TData>) {
  const raw = column.getFilterValue();

  /* ------------------------------------
     Convert raw filter → Date / DateRange
  ------------------------------------- */
  const selected = useMemo(() => {
    const values = parseFilterValue(raw);

    if (multiple) {
      return {
        from: toDate(values[0]),
        to: toDate(values[1]),
      } satisfies DateRange;
    }

    const d = toDate(values[0]);
    return d ? [d] : [];
  }, [raw, multiple]);

  /* ------------------------------------
     State: Do we have a value?
  ------------------------------------- */
  const hasValue = multiple
    ? isDateRange(selected) && (selected.from || selected.to)
    : Array.isArray(selected) && selected.length > 0;

  /* ------------------------------------
     Event Handlers
  ------------------------------------- */
  const handleSelect = useCallback(
    (value: Date | DateRange | undefined) => {
      if (!value) {
        column.setFilterValue(undefined);
        return;
      }

      if (multiple && !("getTime" in value)) {
        const from = value.from?.getTime();
        const to = value.to?.getTime();
        column.setFilterValue(from || to ? [from, to] : undefined);
        return;
      }

      if (!multiple && "getTime" in value) {
        column.setFilterValue(value.getTime());
      }
    },
    [column, multiple]
  );

  const handleReset = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      column.setFilterValue(undefined);
    },
    [column]
  );

  /* ------------------------------------
     Label
  ------------------------------------- */
  const label = useMemo(() => {
    if (multiple && isDateRange(selected)) {
      const has = selected.from || selected.to;
      const text = has
        ? selected.from && selected.to
          ? `${safeFormat(selected.from)} - ${safeFormat(selected.to)}`
          : safeFormat(selected.from ?? selected.to)
        : "Select date range";

      return (
        <span className="flex items-center gap-2">
          <span>{title}</span>
          {has && (
            <>
              <Separator orientation="vertical" className="mx-0.5 h-4" />
              <span>{text}</span>
            </>
          )}
        </span>
      );
    }

    if (!multiple && Array.isArray(selected)) {
      const has = selected.length > 0;
      const text = has ? format(selected[0]!, "MMM dd, yyyy") : "Select date";

      return (
        <span className="flex items-center gap-2">
          <span>{title}</span>
          {has && (
            <>
              <Separator orientation="vertical" className="mx-0.5 h-4" />
              <span>{text}</span>
            </>
          )}
        </span>
      );
    }

    return null;
  }, [multiple, selected, title]);

  /* ---------------------------
     Full Filter Content
  ---------------------------- */
  const FullContent = (
    <div>
      {multiple ? (
        <Calendar
          autoFocus
          captionLayout="dropdown"
          mode="range"
          selected={
            isDateRange(selected)
              ? selected
              : { from: undefined, to: undefined }
          }
          onSelect={handleSelect}
        />
      ) : (
        <Calendar
          captionLayout="dropdown"
          mode="single"
          selected={Array.isArray(selected) ? selected[0] : undefined}
          onSelect={handleSelect}
        />
      )}
    </div>
  );

  /* ------------------------------------
     Render
  ------------------------------------- */

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="border-dashed font-normal"
          >
            {hasValue ? (
              <div
                role="button"
                aria-label={`Clear ${title} filter`}
                tabIndex={0}
                onClick={handleReset}
                className="rounded-sm opacity-70 transition-opacity hover:opacity-100"
              >
                <XCircle />
              </div>
            ) : (
              <CalendarIcon />
            )}

            {label}
          </Button>
        }
      />

      <PopoverContent className="w-auto p-0" align="start">
        {FullContent}
      </PopoverContent>
    </Popover>
  );
}
