import { and, asc, desc, eq, ilike, or, SQL } from "drizzle-orm"
import { PgTableWithColumns } from "drizzle-orm/pg-core"
import { PgColumn } from "drizzle-orm/pg-core"
import { DatabaseType } from "./drizzle-client"
import { PgTable } from "drizzle-orm/pg-core"

/** Any Drizzle table or plain column map can be used as a column source */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TableColumns = Record<string, PgColumn> | PgTableWithColumns<any>

export interface PaginateQueryOptions {
  /** Pagination page number (1-based) */
  page?: number

  /** Number of items per page */
  limit?: number

  /** Sorting direction */
  order?: "asc" | "desc"

  /** Field name to order by — resolved via tableColumns */
  orderField?: string

  /** Free-text search keyword */
  search?: string

  /** Field names to search in — resolved via tableColumns */
  searchFields?: string[]

  /** Additional filter object — { fieldName: value } pairs */
  filter?: Record<string, unknown>
}

export interface PaginationMeta {
  /**
   * Indicates whether the current page is the first page.
   * True when `currentPage` equals 1.
   */
  isFirstPage: boolean

  /**
   * Indicates whether the current page is the last available page.
   * True when `currentPage` is equal to `pageCount`.
   */
  isLastPage: boolean

  /**
   * The current page number being returned.
   */
  currentPage: number

  /**
   * The previous page number if it exists.
   * Returns `null` when the current page is the first page.
   */
  previousPage: number | null

  /**
   * The next page number if it exists.
   * Returns `null` when the current page is the last page.
   */
  nextPage: number | null

  /**
   * Total number of pages available based on the total item count
   * and the number of items per page.
   */
  pageCount: number

  /**
   * Total number of items that match the query in the database,
   * regardless of pagination limits.
   */
  totalCount: number
}

export interface PaginateResult {
  where: SQL | undefined
  orderBy: SQL | undefined
  limit: number
  offset: number
  page: number
}

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 20

/**
 * Extract a column by field name from either a table object or a plain column map.
 */
function getColumn(
  tableColumns: TableColumns,
  field: string
): PgColumn | undefined {
  const col = (tableColumns as Record<string, unknown>)[field]
  return col instanceof Object && "columnType" in col
    ? (col as PgColumn)
    : undefined
}

/**
 * Resolve field name strings to Drizzle column references.
 */
function resolveColumns(
  fields: string[] | undefined,
  tableColumns: TableColumns
): PgColumn[] {
  if (!fields || fields.length === 0) return []

  return fields.flatMap((f) => {
    const col = getColumn(tableColumns, f)
    return col ? [col] : []
  })
}

/**
 * Build a `where` condition for full-text search across columns.
 */
function buildSearchWhere(
  search?: string,
  fields?: PgColumn[]
): SQL | undefined {
  if (!search || !fields?.length) return undefined

  const conditions = fields.map((col) => ilike(col, `%${search}%`))

  if (conditions.length === 0) return undefined

  return conditions.length === 1 ? conditions[0] : or(...conditions)
}

/**
 * Build a `where` condition from a plain filter object.
 * Each key is resolved to a column, and an `eq` condition is applied.
 */
function buildFilterWhere(
  filter: Record<string, unknown> | undefined,
  tableColumns: TableColumns
): SQL | undefined {
  if (!filter || !Object.keys(filter).length) return undefined

  const conditions = Object.entries(filter).flatMap(([key, value]) => {
    const col = getColumn(tableColumns, key)
    return col ? [eq(col, value)] : []
  })

  if (!conditions.length) return undefined

  return conditions.length === 1 ? conditions[0] : and(...conditions)
}

/**
 * Combine filter and search `where` conditions using `and` logic.
 * If both exist, combines them with `and`. Otherwise, returns whichever exists.
 */
function buildWhere(
  filterWhere: SQL | undefined,
  searchWhere: SQL | undefined
) {
  if (!filterWhere || !searchWhere) return filterWhere ?? searchWhere

  return and(filterWhere, searchWhere)
}

/**
 * Build an `orderBy` SQL expression from a field name and direction.
 */
function buildOrderBy(
  orderField: string | undefined,
  order: "asc" | "desc" | undefined,
  tableColumns: TableColumns
): SQL | undefined {
  if (!orderField || !order) return undefined

  const col = getColumn(tableColumns, orderField)

  if (!col) return undefined

  return order === "asc" ? asc(col) : desc(col)
}

/**
 * Calculate pagination metadata based on total count
 */
export async function buildPaginationMeta(
  db: DatabaseType,
  table: PgTable,
  page: number,
  perPage: number
): Promise<PaginationMeta> {
  const totalCount = await db.$count(table)

  const pageCount = Math.ceil(totalCount / perPage)

  return {
    currentPage: page,
    isFirstPage: page === 1,
    isLastPage: page >= pageCount,
    previousPage: page > 1 ? page - 1 : null,
    nextPage: page < pageCount ? page + 1 : null,
    pageCount,
    totalCount,
  }
}

/**
 * Build Drizzle-compatible pagination and query options from a plain options object.
 * Includes metadata when totalCount is provided.
 *
 * @example
 * const { where, orderBy, limit, offset, meta } = buildPaginateOptions(UserTable, input, totalCount);
 *
 * const rows = await db
 *   .select()
 *   .from(UserTable)
 *   .where(where)
 *   .orderBy(orderBy ?? sql`1`)
 *   .limit(limit)
 *   .offset(offset)
 */
export function buildPaginateOptions(
  /**
   * Drizzle table object or a plain `{ fieldName: column }` map.
   * Used to resolve all string-based fields (filter, orderField, searchFields, select).
   *
   * @example
   * tableColumns: UserTable
   * // or
   * tableColumns: { id: UserTable.id, name: UserTable.name }
   */
  tableColumns: TableColumns,
  options: PaginateQueryOptions,
  /**
   * Optional total count of items matching the query.
   * If provided, pagination metadata will be included in the result.
   */
  totalCount?: number,
  defaultPage = DEFAULT_PAGE,
  defaultLimit = DEFAULT_LIMIT
): PaginateResult {
  const {
    page = defaultPage,
    limit = defaultLimit,
    orderField,
    order,
    search,
    searchFields,
    filter,
  } = options

  const pageValue = Math.max(1, Number(page))
  const limitValue = Math.max(1, Number(limit))
  const offset = (pageValue - 1) * limitValue

  const searchColumns = resolveColumns(searchFields, tableColumns)
  const searchWhere = buildSearchWhere(search, searchColumns)
  const filterWhere = buildFilterWhere(filter, tableColumns)

  const where = buildWhere(filterWhere, searchWhere)

  const orderBy = buildOrderBy(orderField, order, tableColumns)

  return {
    where,
    orderBy,
    limit: limitValue,
    offset,
    page: pageValue,
  }
}
