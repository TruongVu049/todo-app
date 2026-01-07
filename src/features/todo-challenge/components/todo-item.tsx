import React, { useState, useEffect, useRef } from 'react'

import type { ViewMode } from '@/types/common'
import { cn } from '@/utils/cn'

import { Todo } from '../types'

interface TodoItemProps {
  todo: Todo
  viewMode?: ViewMode
  onUpdate: (id: string, newText: string) => void
  onDelete: (id: string) => void
  onToggleComplete?: (id: string) => void
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  viewMode = 'list',
  onUpdate,
  onDelete,
  onToggleComplete,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  const handleSave = (e?: React.MouseEvent | React.KeyboardEvent) => {
    e?.stopPropagation()
    const trimmed = editText.trim()
    if (trimmed.length < 3) {
      alert('Nội dung phải có ít nhất 3 ký tự')
      return
    }
    onUpdate(todo.id, trimmed)
    setIsEditing(false)
  }

  const handleCancel = (e?: React.MouseEvent | React.KeyboardEvent) => {
    e?.stopPropagation()
    setEditText(todo.text)
    setIsEditing(false)
  }

  return (
    <div
      className={cn(
        'group flex items-start md:items-center gap-3 md:gap-4 px-3 md:px-4 py-3 md:py-3.5 bg-white dark:bg-[#1e2736] rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary/30 hover:shadow-md transition-all',
        viewMode === 'board' && 'flex-col items-start gap-3 p-4 md:p-5',
        todo.completed && 'bg-slate-50 dark:bg-slate-800/50',
      )}
    >
      {/* Circular Checkbox */}
      <button
        onClick={() => onToggleComplete?.(todo.id)}
        className="relative flex items-center justify-center shrink-0 mt-0.5 md:mt-0"
      >
        <div
          className={cn(
            'size-5 md:size-[22px] rounded-full border-2 flex items-center justify-center transition-colors',
            todo.completed
              ? 'bg-primary border-primary'
              : 'border-slate-300 dark:border-slate-500 hover:border-primary/60',
          )}
        >
          {todo.completed && (
            <span className="material-symbols-outlined text-white text-[12px] md:text-[14px]">
              check
            </span>
          )}
        </div>
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0 flex items-center gap-3">
        {isEditing ? (
          <div className="flex-1 flex gap-2">
            <input
              ref={inputRef}
              type="text"
              className="flex-1 px-3 py-1.5 bg-white dark:bg-slate-800 border border-primary/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm text-slate-900 dark:text-white"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave(e)
                if (e.key === 'Escape') handleCancel(e)
              }}
              onClick={(e) => e.stopPropagation()}
            />
            <div className="flex gap-1">
              <button
                onClick={handleSave}
                className="p-1.5 text-emerald-600 hover:text-emerald-700 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                title="Lưu"
              >
                <span className="material-symbols-outlined text-[18px]">
                  check
                </span>
              </button>
              <button
                onClick={handleCancel}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                title="Hủy"
              >
                <span className="material-symbols-outlined text-[18px]">
                  close
                </span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-w-0">
            <p
              className={cn(
                'text-sm md:text-[15px] text-slate-800 dark:text-slate-200 font-medium line-clamp-2 md:truncate',
                todo.completed &&
                  'text-slate-400 dark:text-slate-500 line-through',
              )}
            >
              {todo.text}
            </p>
            <div className="flex flex-wrap gap-x-2 md:gap-x-4 gap-y-1 mt-1">
              <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px] text-slate-300">
                  add_circle
                </span>
                Tạo: {new Date(todo.createdAt).toLocaleString('vi-VN')}
              </span>
              {todo.dueDate && (
                <span className="text-[10px] text-primary/70 font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">
                    calendar_today
                  </span>
                  Hạn:{' '}
                  {todo.dueDate === 'today'
                    ? 'Hôm nay'
                    : todo.dueDate === 'tomorrow'
                      ? 'Ngày mai'
                      : todo.dueDate}
                </span>
              )}
              {todo.updatedAt && (
                <span className="text-[10px] text-emerald-500/70 font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">
                    edit_note
                  </span>
                  Sửa: {new Date(todo.updatedAt).toLocaleString('vi-VN')}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons - always visible on mobile, hover on desktop */}
      {!isEditing && (
        <div
          className={cn(
            'flex items-center gap-0.5 md:opacity-0 md:group-hover:opacity-100 transition-opacity shrink-0',
            viewMode === 'board' &&
              'w-full justify-end mt-2 pt-2 border-t border-slate-100 dark:border-slate-700',
          )}
        >
          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 text-slate-400 hover:text-primary rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
            title="Chỉnh sửa"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
            title="Xóa"
          >
            <span className="material-symbols-outlined text-[18px]">
              delete
            </span>
          </button>
        </div>
      )}
    </div>
  )
}
