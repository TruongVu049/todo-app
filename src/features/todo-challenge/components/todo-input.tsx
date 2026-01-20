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
      // Quản lý state text và date tại địa phương để tránh re-render toàn bộ app khi đang gõ
      const [text, setText] = useState(initialText) // State cho nội dung todo
      const [date, setDate] = useState(initialDate) // State cho ngày hạn
      const inputRef = useRef<HTMLInputElement>(null) // Dùng để truy cập trực tiếp vào element input (focus/select)

      const { validate, handleKeyDown } = useTodoInput() // Hook tiện ích cho validation và xử lý phím Enter

      // useImperativeHandle: Cho phép component cha có thể gọi hàm 'submit'
      // thông qua ref bí mật của component con này
      useImperativeHandle(ref, () => ({
        submit: handleSave,
      }))

      // Tự động focus và bôi đen nội dung khi ở chế độ chỉnh sửa (Edit mode)
      useEffect(() => {
        if (mode === 'edit') {
          const frameId = requestAnimationFrame(() => {
            inputRef.current?.focus()
            inputRef.current?.select()
          })
          return () => cancelAnimationFrame(frameId)
        }
      }, [mode])

      // Xử lý lưu dữ liệu sau khi validate thành công
      const handleSave = useCallback(() => {
        const trimmed = text.trim()
        if (validate(trimmed)) {
          onSave(trimmed, showDatePicker ? date : undefined) // Gọi callback gửi dữ liệu lên
          if (mode === 'create') {
            setText('') // Reset text sau khi tạo mới thành công
          }
        }
      }, [text, date, validate, onSave, showDatePicker, mode])

      // Xử lý hủy bỏ chỉnh sửa
      const handleCancelClick = useCallback(() => {
        if (mode === 'edit') {
          setText(initialText) // Khôi phục lại text ban đầu
          onCancel?.() // Đóng chế độ edit
        }
      }, [mode, initialText, onCancel])

      return (
        <div className={cn('flex flex-1 gap-2', className)}>
          <input
            ref={inputRef} // Đăng ký ref
            type="text"
            placeholder={placeholder}
            className={
              mode === 'create' ? INPUT_STYLES.create : INPUT_STYLES.edit
            }
            value={text} // Ràng buộc state
            onChange={(e) => setText(e.target.value)} // Cập nhật state local
            onKeyDown={(e) => handleKeyDown(e, handleSave, handleCancelClick)} // Phím tắt
            onClick={(e) => mode === 'edit' && e.stopPropagation()} // Tránh bị click lan ra component cha
          />
          {showDatePicker && (
            <input
              type="date"
              className={INPUT_STYLES.date}
              value={date}
              onChange={(e) => setDate(e.target.value)} // Cập nhật ngày
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
