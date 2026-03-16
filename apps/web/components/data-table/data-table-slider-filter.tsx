"use client";

import { useId, useMemo } from "react";

import type { Column } from "@tanstack/react-table";
import { PlusCircle, XCircle } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { Separator } from "@workspace/ui/components/separator";
import { Slider } from "@workspace/ui/components/slider";
import { cn } from "@workspace/ui/lib/utils";

type RangeValue = [number, number];

interface Range {
  min: number;
  max: number;
}

interface DataTableSliderFilterProps<TData> {
  column: Column<TData, unknown>;
  title?: string;
}

/* ---------------------------
   Utility Functions
---------------------------- */
function isValidRange(value: unknown): value is RangeValue {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    value.every((v) => typeof v === "number")
  );
}

function parseRange(value: unknown): RangeValue | undefined {
  if (
    Array.isArray(value) &&
    value.length === 2 &&
    value.every(
      (v) =>
        (typeof v === "string" || typeof v === "number") &&
        !Number.isNaN(Number(v))
    )
  ) {
    return [Number(value[0]), Number(value[1])];
  }
  return undefined;
}

/* ---------------------------
   Main Component
---------------------------- */
export function DataTableSliderFilter<TData>({
  column,
  title,
}: DataTableSliderFilterProps<TData>) {
  "use no memo";
  const id = useId();
  const unit = column.columnDef.meta?.unit;

  const filterValue = parseRange(column.getFilterValue());
  const defaultRange = column.columnDef.meta?.range;

  /* ---------------------------
     Range & Step Calculation
  ---------------------------- */
  const { min, max, step } = useMemo<Range & { step: number }>(() => {
    let rangeMin = 0;
    let rangeMax = 100;

    if (defaultRange && isValidRange(defaultRange)) {
      [rangeMin, rangeMax] = defaultRange;
    } else {
      const values = column.getFacetedMinMaxValues();
      if (
        Array.isArray(values) &&
        values.length === 2 &&
        typeof values[0] === "number" &&
        typeof values[1] === "number"
      ) {
        [rangeMin, rangeMax] = values;
      }
    }

    const span = rangeMax - rangeMin;
    const step =
      span <= 20
        ? 1
        : span <= 100
          ? Math.ceil(span / 20)
          : Math.ceil(span / 50);

    return { min: rangeMin, max: rangeMax, step };
  }, [column, defaultRange]);

  const currentRange = filterValue ?? [min, max];

  /* ---------------------------
     Handlers
  ---------------------------- */
  const updateFromInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (!Number.isNaN(value) && value >= min && value <= currentRange[1]) {
      column.setFilterValue([value, currentRange[1]]);
    }
  };

  const updateToInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (!Number.isNaN(value) && value <= max && value >= currentRange[0]) {
      column.setFilterValue([currentRange[0], value]);
    }
  };

  const updateSlider = (value: number | readonly number[]) => {
    if (isValidRange(value)) column.setFilterValue(value);
  };

  const resetFilter = (e: React.MouseEvent) => {
    if (e.target instanceof HTMLDivElement) e.stopPropagation();
    column.setFilterValue(undefined);
  };

  const format = (v: number) =>
    v.toLocaleString(undefined, { maximumFractionDigits: 0 });

  /* ---------------------------
     Shared Input Block
  ---------------------------- */
  const RangeInputs = (
    <div className="flex items-center gap-4">
      {(["from", "to"] as const).map((type, index) => {
        const htmlId = `${id}-${type}`;
        const value = currentRange[index];

        return (
          <div key={type} className="relative">
            <Label htmlFor={htmlId} className="sr-only">
              {type}
            </Label>
            <Input
              id={htmlId}
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              min={min}
              max={max}
              aria-valuemin={min}
              aria-valuemax={max}
              placeholder={(index === 0 ? min : max).toString()}
              value={value?.toString()}
              onChange={index === 0 ? updateFromInput : updateToInput}
              className={cn("h-8 w-24", unit && "pr-8")}
            />
            {unit && (
              <span className="absolute top-0 right-0 bottom-0 flex items-center rounded-r-md bg-accent px-2 text-sm text-muted-foreground">
                {unit}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );

  /* ---------------------------
     Full Filter Content
  ---------------------------- */
  const FilterContent = (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <p className="leading-none font-medium">{title}</p>
        {RangeInputs}

        <Label htmlFor={`${id}-slider`} className="sr-only">
          {title} slider
        </Label>
        <Slider
          id={`${id}-slider`}
          min={min}
          max={max}
          step={step}
          value={currentRange}
          onValueChange={updateSlider}
        />
      </div>

      <Button
        variant="outline"
        size="sm"
        aria-label={`Clear ${title} filter`}
        onClick={resetFilter}
      >
        Clear
      </Button>
    </div>
  );

  /* ---------------------------
     Render
  ---------------------------- */

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="border-dashed font-normal"
          >
            {filterValue ? (
              <div
                role="button"
                aria-label={`Clear ${title} filter`}
                tabIndex={0}
                className="rounded-sm opacity-70 transition-opacity hover:opacity-100"
                onClick={resetFilter}
              >
                <XCircle />
              </div>
            ) : (
              <PlusCircle />
            )}
            <span>{title}</span>

            {filterValue && (
              <>
                <Separator orientation="vertical" className="mx-0.5 h-4" />
                {format(filterValue[0])} – {format(filterValue[1])}
                {unit && ` ${unit}`}
              </>
            )}
          </Button>
        }
      />

      <PopoverContent align="start" className="w-auto">
        {FilterContent}
      </PopoverContent>
    </Popover>
  );
}
