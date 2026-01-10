import React, {
  memo,
  useRef,
  useEffect,
  useCallback,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react'

import { cn } from '@/utils/cn'

import { useTodoInput, INPUT_STYLES } from '../hooks/use-todo-input'

interface TodoInputProps {
  initialText?: string
  initialDate?: string
  onSave: (text: string, date?: string) => void
  onCancel?: () => void
  placeholder?: string
  showDatePicker?: boolean
  mode: 'create' | 'edit'
  className?: string
}

export interface TodoInputHandle {
  submit: () => void
}

export const TodoInput = memo(
  forwardRef<TodoInputHandle, TodoInputProps>(
    (
      {
        initialText = '',
        initialDate = '',
        onSave,
        onCancel,
        placeholder = 'Nhập nội dung công việc...',
        showDatePicker = false,
        mode,
        className,
      },
      ref,
    ) => {
      const [text, setText] = useState(initialText)
      const [date, setDate] = useState(initialDate)
      const inputRef = useRef<HTMLInputElement>(null)

      const { validate, handleKeyDown } = useTodoInput()

      useImperativeHandle(ref, () => ({
        submit: handleSave,
      }))

      useEffect(() => {
        if (mode === 'edit') {
          const frameId = requestAnimationFrame(() => {
            inputRef.current?.focus()
            inputRef.current?.select()
          })
          return () => cancelAnimationFrame(frameId)
        }
      }, [mode])

      const handleSave = useCallback(() => {
        const trimmed = text.trim()
        if (validate(trimmed)) {
          onSave(trimmed, showDatePicker ? date : undefined)
          if (mode === 'create') {
            setText('')
          }
        }
      }, [text, date, validate, onSave, showDatePicker, mode])

      const handleCancelClick = useCallback(() => {
        if (mode === 'edit') {
          setText(initialText)
          onCancel?.()
        }
      }, [mode, initialText, onCancel])

      return (
        <div className={cn('flex flex-1 gap-2', className)}>
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            className={
              mode === 'create' ? INPUT_STYLES.create : INPUT_STYLES.edit
            }
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, handleSave, handleCancelClick)}
            onClick={(e) => mode === 'edit' && e.stopPropagation()}
          />
          {showDatePicker && (
            <input
              type="date"
              className={INPUT_STYLES.date}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          )}
          {mode === 'edit' && (
            <div
              className="flex gap-1"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
              role="none"
            >
              <button
                type="button"
                onClick={handleSave}
                className="p-1.5 text-emerald-600 hover:text-emerald-700 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                title="Lưu"
              >
                <span className="material-symbols-outlined text-[18px]">
                  check
                </span>
              </button>
              <button
                type="button"
                onClick={handleCancelClick}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                title="Hủy"
              >
                <span className="material-symbols-outlined text-[18px]">
                  close
                </span>
              </button>
            </div>
          )}
        </div>
      )
    },
  ),
)

TodoInput.displayName = 'TodoInput'
