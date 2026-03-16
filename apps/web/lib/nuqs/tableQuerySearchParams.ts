import {
  createLoader,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";

import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@/constant";

export const tableQuerySearchParams = createLoader({
  page: parseAsInteger
    .withDefault(DEFAULT_PAGE_INDEX)
    .withOptions({ clearOnDefault: true }),

  limit: parseAsInteger
    .withDefault(DEFAULT_PAGE_SIZE)
    .withOptions({ clearOnDefault: true }),

  search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),

  order: parseAsStringLiteral(["asc", "desc"]).withOptions({
    clearOnDefault: true,
  }),

  orderField: parseAsString.withOptions({ clearOnDefault: true }),
});
