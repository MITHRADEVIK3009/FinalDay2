"use client"

import { useState, useEffect } from "react"
import type { ApiResponse } from "@/lib/api-client"
import { OfflineQueue } from "@/lib/api-client"

export function useApi<T = any>(apiFunction: () => Promise<ApiResponse<T>>, dependencies: any[] = []) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [offline, setOffline] = useState(false)

  const execute = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await apiFunction()

      if (response.success) {
        setData(response.data || null)
        setOffline(false)
      } else {
        setError(response.error || "Unknown error")
        setOffline(response.offline || false)
      }
    } catch (err) {
      setError("Network error")
      setOffline(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    execute()
  }, dependencies)

  return { data, loading, error, offline, refetch: execute }
}

export function useOfflineQueue() {
  const [queue] = useState(() => OfflineQueue.getInstance())

  useEffect(() => {
    queue.loadFromStorage()

    const handleOnline = () => {
      queue.processQueue()
    }

    window.addEventListener("online", handleOnline)
    return () => window.removeEventListener("online", handleOnline)
  }, [queue])

  return {
    addToQueue: (action: string, data: any) => queue.addToQueue(action, data),
    processQueue: () => queue.processQueue(),
  }
}
