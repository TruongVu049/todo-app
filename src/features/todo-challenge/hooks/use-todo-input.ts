import { useCallback } from 'react'

const MIN_TEXT_LENGTH = 3

interface UseTodoInputOptions {
  minLength?: number
  onValidationError?: (message: string) => void
}

interface UseTodoInputReturn {
  validate: (text: string) => boolean
  handleKeyDown: (
    e: React.KeyboardEvent<HTMLInputElement>,
    onEnter: () => void,
    onEscape?: () => void,
  ) => void
}

export const useTodoInput = (
  options: UseTodoInputOptions = {},
): UseTodoInputReturn => {
  const {
    minLength = MIN_TEXT_LENGTH, // Độ dài tối thiểu chuẩn (mặc định là 3)
    onValidationError = (msg) => alert(msg), // Hàm xử lý khi không hợp lệ (mặc định là alert)
  } = options

  // Hàm validate: Kiểm tra xem text nhập vào có hợp lệ không
  const validate = useCallback(
    (text: string): boolean => {
      const trimmed = text.trim()
      if (trimmed.length < minLength) {
        onValidationError(`Nội dung phải có ít nhất ${minLength} ký tự`)
        return false
      }
      return true
    },
    [minLength, onValidationError],
  )

  // Hàm xử lý sự kiện phím tắt (Keyboard Shortcuts)
  const handleKeyDown = useCallback(
    (
      e: React.KeyboardEvent<HTMLInputElement>,
      onEnter: () => void, // Hành động khi nhấn Enter
      onEscape?: () => void, // Hành động khi nhấn Escape (tùy chọn)
    ) => {
      if (e.key === 'Enter') {
        e.preventDefault() // Ngăn chặn hành vi mặc định của form
        onEnter()
      }
      if (e.key === 'Escape' && onEscape) {
        e.preventDefault()
        onEscape()
      }
    },
    [],
  )

  return { validate, handleKeyDown }
}

// Các class CSS dùng chung cho các loại input trong tính năng Todo Challenge
export const INPUT_STYLES = {
  create:
    'flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-slate-900 dark:text-white',
  edit: 'flex-1 px-3 py-1.5 bg-white dark:bg-slate-800 border border-primary/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm text-slate-900 dark:text-white',
  date: 'px-3 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-slate-900 dark:text-white text-sm',
} as const
