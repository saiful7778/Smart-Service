"use client";

import { useQuery } from "@tanstack/react-query";

import { DataTableEmpty } from "@/components/data-table/data-table-empty";
import DataTableGlobalSearch from "@/components/data-table/data-table-global-search";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";

import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@/constant";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { useTableQueryState } from "@/hooks/use-table-query-state";
import { orpcTQClient } from "@/server/orpc.client";

import { UsersTable } from "./user-table/UsersTable";

export default function UserManagementTable({
  page,
  limit,
  search,
  searchFields,
}: {
  page?: number | undefined;
  limit?: number | undefined;
  search?: string | undefined;
  searchFields?: string[] | undefined;
}) {
  "use no memo";
  const { filters, setFilters, setSearchFilter } = useTableQueryState({
    defaultPage: page,
    defaultLimit: limit,
    defaultSearch: search,
  });

  const { data, isLoading, isError, error, refetch } = useQuery(
    orpcTQClient.user.list.queryOptions({
      input: {
        page: filters.page,
        limit: filters.limit,
        search: filters.search ?? undefined,
        searchFields,
        order: filters.order ?? undefined,
        orderField: filters.orderField ?? undefined,
      },
    })
  );

  const globalSearch = useDebouncedCallback(
    (searchValue: string | null) => setSearchFilter(searchValue),
    500
  );

  return (
    <div className="space-y-3">
      <DataTableGlobalSearch
        searchValue={filters.search}
        setSearchValue={globalSearch}
        refresh={refetch}
      />
      {isLoading ? (
        <DataTableSkeleton />
      ) : isError ? (
        <div>{String(error)}</div>
      ) : !data || data.data.totalCount === 0 ? (
        <DataTableEmpty />
      ) : (
        <UsersTable
          data={data.data}
          filters={{
            page: filters.page,
            limit: filters.limit,
            search: filters.search ?? undefined,
            order: filters.order ?? undefined,
            orderField: filters.orderField ?? undefined,
          }}
          setFilters={(filters) => {
            setFilters({
              page: filters?.page ?? DEFAULT_PAGE_INDEX,
              limit: filters?.limit ?? DEFAULT_PAGE_SIZE,
              order: filters?.order ?? null,
              orderField: filters?.orderField ?? null,
            });
          }}
        />
      )}
    </div>
  );
}
