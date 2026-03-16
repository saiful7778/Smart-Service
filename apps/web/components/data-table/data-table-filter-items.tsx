import { Column } from "@tanstack/react-table"
import { DataTableSliderFilter } from "./data-table-slider-filter"
import { DataTableDateFilter } from "./data-table-date-filter"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { Input } from "@workspace/ui/components/input"
import { cn } from "@workspace/ui/lib/utils"

interface DataTableFilterItemProps<TData> {
  column: Column<TData>
}

export function DataTableFilterItems<TData>({
  column,
}: DataTableFilterItemProps<TData>) {
  "use no memo"
  const columnMeta = column.columnDef.meta
  const columnVariant = columnMeta?.variant

  if (!columnMeta || !columnVariant) return null

  switch (columnVariant) {
    case "text":
      return (
        <Input
          placeholder={columnMeta.placeholder ?? columnMeta.label}
          value={(column.getFilterValue() as string) ?? ""}
          onChange={(event) => column.setFilterValue(event.target.value)}
          className="w-40 lg:w-56"
        />
      )

    case "number":
      return (
        <div className="relative">
          <Input
            type="number"
            inputMode="numeric"
            placeholder={columnMeta.placeholder ?? columnMeta.label}
            value={(column.getFilterValue() as string) ?? ""}
            onChange={(event) => column.setFilterValue(event.target.value)}
            className={cn("w-30", columnMeta.unit && "pr-8")}
          />
          {columnMeta.unit && (
            <span className="absolute top-0 right-0 bottom-0 flex items-center rounded-r-md bg-accent px-2 text-sm text-muted-foreground">
              {columnMeta.unit}
            </span>
          )}
        </div>
      )

    case "range":
      return (
        <DataTableSliderFilter
          column={column}
          title={columnMeta.label ?? column.id}
        />
      )

    case "date":
    case "dateRange":
      return (
        <DataTableDateFilter
          column={column}
          title={columnMeta.label ?? column.id}
          multiple={columnMeta.variant === "dateRange"}
        />
      )

    case "select":
    case "multiSelect":
      return (
        <DataTableFacetedFilter
          column={column}
          title={columnMeta.label ?? column.id}
          options={columnMeta.options ?? []}
          multiple={columnMeta.variant === "multiSelect"}
        />
      )

    default:
      return null
  }
}
