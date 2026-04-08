"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function LiveSearch({ defaultValue }: { defaultValue?: string }) {
  const router = useRouter()
  const params = useSearchParams()

  const [search, setSearch] = useState(defaultValue || "")

  useEffect(() => {
    const delay = setTimeout(() => {
      const newParams = new URLSearchParams(params)

      if (search) newParams.set("search", search)
      else newParams.delete("search")

      router.push(`?${newParams.toString()}`)
    }, 400)

    return () => clearTimeout(delay)
  }, [search])

  return (
    <input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Live search employees..."
      className="
      border
      border-gray-300
      dark:border-gray-700
      bg-white
      dark:bg-gray-900
      px-3
      py-2
      rounded-lg
      w-56
      text-gray-800
      dark:text-gray-200
      "
    />
  )
}