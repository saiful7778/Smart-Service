"use client"

import { useState } from "react"
import { QueryClientProvider } from "@tanstack/react-query"
import { createQueryClient } from "@/lib/tanstack/query/query-client"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

export default function TanstackQueryProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [queryClient] = useState(() => createQueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}
