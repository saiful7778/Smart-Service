import type { Column } from "@tanstack/react-table";
import {
  ArrowDown01,
  ArrowDownAZ,
  ArrowUp01,
  ArrowUpAZ,
  ArrowUpDown,
  EyeOff,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { cn } from "@workspace/ui/lib/utils";

interface DataTableColumnHeaderProps<
  TData,
  TValue,
> extends React.ComponentProps<typeof DropdownMenuTrigger> {
  column: Column<TData, TValue>;
  label: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  label,
  className,
  ...props
}: DataTableColumnHeaderProps<TData, TValue>) {
  "use no memo";
  const columnMeta = column.columnDef.meta;

  const isSorted = column.getIsSorted();
  const canSort = column.getCanSort();
  const canHide = column.getCanHide();

  if (!canSort && !canHide) {
    return <div className={cn(className)}>{label}</div>;
  }

  return (
    <div className="flex items-center justify-between gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            "-ml-1.5 flex h-8 items-center gap-1.5 rounded-md px-2 py-1.5 hover:bg-accent focus:ring-1 focus:ring-ring focus:outline-none data-[state=open]:bg-accent [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground",
            className
          )}
          {...props}
        >
          {label}
          {canSort &&
            (isSorted === "desc" ? (
              columnMeta?.variant === "number" ? (
                <ArrowDown01 />
              ) : (
                <ArrowDownAZ />
              )
            ) : isSorted === "asc" ? (
              columnMeta?.variant === "number" ? (
                <ArrowUp01 />
              ) : (
                <ArrowUpAZ />
              )
            ) : (
              <ArrowUpDown />
            ))}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-28">
          <DropdownMenuGroup>
            {canSort && (
              <>
                <DropdownMenuCheckboxItem
                  className="relative pr-8 pl-2 [&_svg]:text-muted-foreground [&>span:first-child]:right-2 [&>span:first-child]:left-auto"
                  checked={isSorted === "asc"}
                  onClick={() => column.toggleSorting(false)}
                >
                  {columnMeta?.variant === "number" ? (
                    <>
                      <ArrowDown01 />
                      <span>0 - 1</span>
                    </>
                  ) : (
                    <>
                      <ArrowDownAZ />
                      <span>A - Z</span>
                    </>
                  )}
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  className="relative pr-8 pl-2 [&_svg]:text-muted-foreground [&>span:first-child]:right-2 [&>span:first-child]:left-auto"
                  checked={isSorted === "desc"}
                  onClick={() => column.toggleSorting(true)}
                >
                  {columnMeta?.variant === "number" ? (
                    <>
                      <ArrowUp01 />
                      <span>1 - 0</span>
                    </>
                  ) : (
                    <>
                      <ArrowUpAZ />
                      <span>Z - A</span>
                    </>
                  )}
                </DropdownMenuCheckboxItem>
                {isSorted && (
                  <DropdownMenuItem
                    className="pl-2 [&_svg]:text-muted-foreground"
                    onClick={() => column.clearSorting()}
                  >
                    <X />
                    <span>Reset</span>
                  </DropdownMenuItem>
                )}
              </>
            )}
            {canHide && (
              <DropdownMenuCheckboxItem
                className="relative pr-8 pl-2 [&_svg]:text-muted-foreground [&>span:first-child]:right-2 [&>span:first-child]:left-auto"
                checked={!column.getIsVisible()}
                onClick={() => column.toggleVisibility(false)}
              >
                <EyeOff />
                <span>Hide</span>
              </DropdownMenuCheckboxItem>
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
