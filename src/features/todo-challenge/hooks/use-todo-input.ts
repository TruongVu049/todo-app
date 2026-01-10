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
    minLength = MIN_TEXT_LENGTH,
    onValidationError = (msg) => alert(msg),
  } = options

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

  const handleKeyDown = useCallback(
    (
      e: React.KeyboardEvent<HTMLInputElement>,
      onEnter: () => void,
      onEscape?: () => void,
    ) => {
      if (e.key === 'Enter') {
        e.preventDefault()
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

export const INPUT_STYLES = {
  create:
    'flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-slate-900 dark:text-white',
  edit: 'flex-1 px-3 py-1.5 bg-white dark:bg-slate-800 border border-primary/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm text-slate-900 dark:text-white',
  date: 'px-3 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-slate-900 dark:text-white text-sm',
} as const
