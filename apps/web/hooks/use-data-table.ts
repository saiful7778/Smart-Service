import {
  ColumnFiltersState,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  RowSelectionState,
  SortingState,
  Updater,
  useReactTable,
  VisibilityState,
  type TableOptions,
} from "@tanstack/react-table"
import { useCallback, useMemo, useState } from "react"
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@/constant"
import type { FiltersType } from "@/types"

interface UseDataTableProps<TData>
  extends
    Omit<
      TableOptions<TData>,
      | "state"
      | "pageCount"
      | "getCoreRowModel"
      | "manualFiltering"
      | "manualPagination"
      | "manualSorting"
    >,
    Required<Pick<TableOptions<TData>, "pageCount">> {
  enableAdvancedFilter?: boolean
  filters: Omit<FiltersType, "search">
  setFilters: (filters: Omit<FiltersType, "search">) => void
}

export function useDataTable<TData>({
  columns,
  filters,
  setFilters,
  pageCount = -1,
  enableAdvancedFilter = false,
  ...props
}: UseDataTableProps<TData>) {
  "use no memo"
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const {
    page = DEFAULT_PAGE_INDEX,
    limit = DEFAULT_PAGE_SIZE,
    order,
    orderField,
  } = filters

  const pagination: PaginationState = useMemo(() => {
    return {
      pageIndex: page - 1, // zero-based index -> one-based index
      pageSize: limit,
    }
  }, [page, limit])

  const onPaginationChange = useCallback(
    (updaterOrValue: Updater<PaginationState>) => {
      const next =
        typeof updaterOrValue === "function"
          ? updaterOrValue(pagination)
          : updaterOrValue

      void setFilters({
        page: next.pageIndex + 1,
        limit: next.pageSize,
      })
    },
    [pagination, setFilters]
  )

  // const [sorting, setSorting] = useState<SortingState>([]);

  const sorting: SortingState = useMemo(() => {
    if (!orderField || !order) return []
    return [{ id: orderField, desc: order === "desc" ? true : false }]
  }, [orderField, order])

  const onSortingChange = useCallback(
    (updaterOrValue: Updater<SortingState>) => {
      const next =
        typeof updaterOrValue === "function"
          ? updaterOrValue(sorting)
          : updaterOrValue

      if (next.length > 0) {
        void setFilters({
          orderField: next[0]!.id,
          order: next[0]!.desc ? "desc" : "asc",
        })
      } else {
        void setFilters({
          orderField: undefined,
          order: undefined,
        })
      }

      // void setSorting(next as ExtendedColumnSort<TData>[]);
    },
    [sorting, setFilters]
  )

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const filterableColumns = useMemo(() => {
    if (enableAdvancedFilter) return []

    return columns.filter((column) => column.enableColumnFilter)
  }, [columns, enableAdvancedFilter])

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const onColumnFiltersChange = useCallback(
    (updaterOrValue: Updater<ColumnFiltersState>) => {
      if (enableAdvancedFilter) return

      setColumnFilters((prev) => {
        const next =
          typeof updaterOrValue === "function"
            ? updaterOrValue(prev)
            : updaterOrValue

        const filterUpdates = next.reduce<
          Record<string, string | string[] | null>
        >((acc, filter) => {
          if (filterableColumns.find((column) => column.id === filter.id)) {
            acc[filter.id] = filter.value as string | string[]
          }
          return acc
        }, {})

        for (const prevFilter of prev) {
          if (!next.some((filter) => filter.id === prevFilter.id)) {
            filterUpdates[prevFilter.id] = null
          }
        }

        return next
      })
    },
    [filterableColumns, enableAdvancedFilter]
  )

  // eslint-disable-next-line react-hooks/incompatible-library
  return useReactTable({
    ...props,
    pageCount,
    columns,
    state: {
      pagination,
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    defaultColumn: {
      ...props.defaultColumn,
      enableColumnFilter: false,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onPaginationChange,
    onSortingChange,
    onColumnFiltersChange,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    manualPagination: true,
    manualSorting: true,
    // manualFiltering: true,
  })
}
