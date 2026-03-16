"use client";

import { DataTable } from "@/components/data-table/data-table";
import { useDataTable } from "@/hooks/use-data-table";
import { FiltersType } from "@/types";
import { teamsTableColumn } from "./userTableColumn";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { ListUserOutput } from "../../api/user.router";

interface UsersTableProps {
  data: ListUserOutput["data"];
  filters: FiltersType;
  setFilters: (filters: Omit<FiltersType, "search">) => void;
}

export function UsersTable({ data, filters, setFilters }: UsersTableProps) {
  "use no memo";
  const table = useDataTable({
    data: data.data,
    columns: teamsTableColumn,
    pageCount: data.pageCount,
    filters,
    setFilters,
    meta: {
      queryKeys: {
        searchText: filters?.search,
      },
    },
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
