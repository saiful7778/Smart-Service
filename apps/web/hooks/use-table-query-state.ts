import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@/constant"
import {
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from "nuqs"

export function useTableQueryState({
  defaultPage = DEFAULT_PAGE_INDEX,
  defaultLimit = DEFAULT_PAGE_SIZE,
  defaultSearch = "",
}: {
  defaultPage?: number
  defaultLimit?: number
  defaultSearch?: string
} = {}) {
  const [filters, setFilters] = useQueryStates(
    {
      page: parseAsInteger
        .withDefault(defaultPage)
        .withOptions({ clearOnDefault: true }),

      limit: parseAsInteger
        .withDefault(defaultLimit)
        .withOptions({ clearOnDefault: true }),

      search: parseAsString
        .withDefault(defaultSearch)
        .withOptions({ clearOnDefault: true }),

      order: parseAsStringLiteral(["asc", "desc"]).withOptions({
        clearOnDefault: true,
      }),

      orderField: parseAsString.withOptions({ clearOnDefault: true }),
    },
    {
      history: "replace",
    }
  )

  return {
    filters,
    setFilters: (updates: Partial<Omit<typeof filters, "search">>) =>
      setFilters(updates),
    setSearchFilter: (searchValue: string | null) =>
      setFilters({ search: searchValue, page: DEFAULT_PAGE_INDEX }),
  }
}
