import { debounce, type DebouncedFunc } from 'lodash-es'
import { useState, useEffect, useMemo, useCallback } from 'react'

export function useDebouncedValue<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 300,
): DebouncedFunc<T> {
  const debouncedFn = useMemo(
    () => debounce(callback, delay),
    [callback, delay],
  )

  useEffect(() => {
    return () => {
      debouncedFn.cancel()
    }
  }, [debouncedFn])

  return debouncedFn
}

interface UseDebouncedSearchOptions {
  delay?: number
  onSearch: (query: string) => void
}

export function useDebouncedSearch({
  delay = 300,
  onSearch,
}: UseDebouncedSearchOptions) {
  const [inputValue, setInputValue] = useState('')

  const debouncedSearch = useDebouncedCallback(onSearch, delay)

  const handleChange = useCallback(
    (value: string) => {
      setInputValue(value)
      debouncedSearch(value)
    },
    [debouncedSearch],
  )

  const handleClear = useCallback(() => {
    setInputValue('')
    onSearch('')
  }, [onSearch])

  return {
    inputValue,
    handleChange,
    handleClear,
  }
}
