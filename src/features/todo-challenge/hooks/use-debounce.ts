import { debounce, type DebouncedFunc } from 'lodash-es'
import { useState, useEffect, useMemo, useCallback } from 'react'

export function useDebouncedValue<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value) // State lưu trữ giá trị sau khi đã debounce

  useEffect(() => {
    // Thiết lập một timer để cập nhật giá trị sau một khoảng delay
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Hàm cleanup: Hủy bỏ timer nếu giá trị 'value' hoặc 'delay' thay đổi trước khi hết hạn
    // Điều này ngăn chặn việc cập nhật state liên tục khi người dùng gõ phím nhanh
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 300,
): DebouncedFunc<T> {
  // useMemo: Ghi nhớ hàm debounce được tạo bởi lodash để nó không bị tạo lại mỗi lần render
  const debouncedFn = useMemo(
    () => debounce(callback, delay),
    [callback, delay],
  )

  // Đảm bảo hủy bỏ các tác vụ đang chờ xử lý của debounce khi component bị unmount
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

// Hook chuyên dụng cho chức năng tìm kiếm có debounce
export function useDebouncedSearch({
  delay = 300,
  onSearch,
}: UseDebouncedSearchOptions) {
  const [inputValue, setInputValue] = useState('') // State quản lý nội dung input tức thời (mượt mà)

  // Tạo hàm callback debounce để gọi API tìm kiếm hoặc lọc dữ liệu
  const debouncedSearch = useDebouncedCallback(onSearch, delay)

  // Xử lý sự kiện thay đổi input
  const handleChange = useCallback(
    (value: string) => {
      setInputValue(value) // Cập nhật ngay lập tức text trên UI
      debouncedSearch(value) // Gọi hàm tìm kiếm sau khoảng delay
    },
    [debouncedSearch],
  )

  // Hàm xóa nhanh nội dung tìm kiếm
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
