import React, { useState, memo, useCallback, useMemo } from 'react'

import type { ViewMode } from '@/types/common'
import { cn } from '@/utils/cn'

import { Todo } from '../types'

import { TodoInput } from './todo-input'

interface TodoItemProps {
  todo: Todo
  viewMode?: ViewMode
  onUpdate: (id: string, newText: string) => void
  onDelete: (id: string) => void
  onToggleComplete?: (id: string) => void
}

export const TodoItem: React.FC<TodoItemProps> = memo(
  ({ todo, viewMode = 'list', onUpdate, onDelete, onToggleComplete }) => {
    const [isEditing, setIsEditing] = useState(false)

    const handleSave = useCallback(
      (newText: string) => {
        onUpdate(todo.id, newText)
        setIsEditing(false)
      },
      [todo.id, onUpdate],
    )

    const handleCancel = useCallback(() => {
      setIsEditing(false)
    }, [])

    const handleToggle = useCallback(() => {
      onToggleComplete?.(todo.id)
    }, [todo.id, onToggleComplete])

    const handleEdit = useCallback(() => {
      setIsEditing(true)
    }, [])

    const handleDelete = useCallback(() => {
      onDelete(todo.id)
    }, [todo.id, onDelete])

    const createdAtStr = useMemo(
      () => new Date(todo.createdAt).toLocaleString('vi-VN'),
      [todo.createdAt],
    )

    const dueDateStr = useMemo(() => {
      if (!todo.dueDate) return null
      if (todo.dueDate === 'today') return 'Hôm nay'
      if (todo.dueDate === 'tomorrow') return 'Ngày mai'
      return todo.dueDate
    }, [todo.dueDate])

    const updatedAtStr = useMemo(
      () =>
        todo.updatedAt
          ? new Date(todo.updatedAt).toLocaleString('vi-VN')
          : null,
      [todo.updatedAt],
    )

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
          type="button"
          onClick={handleToggle}
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
            <TodoInput
              mode="edit"
              initialText={todo.text}
              onSave={handleSave}
              onCancel={handleCancel}
            />
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
                  Tạo: {createdAtStr}
                </span>
                {todo.dueDate && (
                  <span className="text-[10px] text-primary/70 font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">
                      calendar_today
                    </span>
                    Hạn: {dueDateStr}
                  </span>
                )}
                {todo.updatedAt && (
                  <span className="text-[10px] text-emerald-500/70 font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">
                      edit_note
                    </span>
                    Sửa: {updatedAtStr}
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
              type="button"
              onClick={handleEdit}
              className="p-1.5 text-slate-400 hover:text-primary rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
              title="Chỉnh sửa"
            >
              <span className="material-symbols-outlined text-[18px]">
                edit
              </span>
            </button>
            <button
              type="button"
              onClick={handleDelete}
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
  },
)

TodoItem.displayName = 'TodoItem'
