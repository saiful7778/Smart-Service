"use client"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { cn } from "@workspace/ui/lib/utils"
import { RefreshCw, X } from "lucide-react"
import { useState } from "react"

interface DataTableGlobalSearchProps {
  searchValue: string | null
  setSearchValue: (value: string | null) => void
  refresh: () => void
}

export default function DataTableGlobalSearch({
  searchValue,
  setSearchValue,
  refresh,
}: DataTableGlobalSearchProps) {
  const [isOnRefresh, setIsOnRefresh] = useState<boolean>(false)
  const [inputValue, setInputValue] = useState<string>(searchValue ?? "")

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchValue(value)
    setInputValue(value)
  }

  const handleReset = () => {
    setSearchValue(null)
    setInputValue("")
  }

  const handleRefresh = () => {
    refresh()
    setIsOnRefresh(true)
    setTimeout(() => {
      setIsOnRefresh(false)
    }, 2000)
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-1 items-center gap-2">
        <Input
          name="search"
          placeholder="Search...."
          className="w-37.5 lg:w-62.5"
          value={inputValue}
          onChange={handleOnChange}
        />
        {!!searchValue && (
          <Button variant="ghost" onClick={handleReset}>
            <span>Reset</span>
            <X />
          </Button>
        )}
      </div>
      <Button
        onClick={handleRefresh}
        size="icon-sm"
        variant="outline"
        disabled={isOnRefresh}
      >
        <RefreshCw className={cn("size-4", isOnRefresh && "animate-spin")} />
      </Button>
    </div>
  )
}
