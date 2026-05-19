'use client'

import { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api'

export function useFetch<T>(url?: string) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!url) return

    const fetchData = async () => {
      try {
        setLoading(true)

        const result = await apiFetch<T[]>(url)

        setData(result)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [url])

  return {
    data,
    loading,
    error,
  }
}