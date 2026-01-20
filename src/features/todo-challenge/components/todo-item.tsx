import React, { useState, memo, useCallback, useMemo } from 'react'

import type { ViewMode } from '@/types/common'
import { cn } from '@/utils/cn'

import { useSelection } from '../context/selection-context'
import { Todo } from '../types'

import { TodoInput } from './todo-input'

interface TodoItemProps {
  todo: Todo
  viewMode?: ViewMode
  onUpdate: (id: string, newText: string) => void
  onDelete: (id: string) => void
  onToggleComplete?: (id: string) => void
}

// memo(): Ngăn chặn việc re-render component nếu props không thay đổi (tăng hiệu năng render list)
export const TodoItem: React.FC<TodoItemProps> = memo(
  ({ todo, viewMode = 'list', onUpdate, onDelete, onToggleComplete }) => {
    const [isEditing, setIsEditing] = useState(false)
    const { isSelected, toggleSelect } = useSelection() // Hook cho multi-select
    const selected = isSelected(todo.id) // Kiểm tra todo này có đang được chọn không

    // useCallback: Ghi nhớ reference của hàm, tránh việc tạo lại hàm mới mỗi khi render
    // giúp các component con (như TodoInput) không bị re-render thừa
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

    // Xử lý khi click vào checkbox chọn
    const handleSelectionToggle = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation() // Ngăn sự kiện lan lên parent
        toggleSelect(todo.id)
      },
      [todo.id, toggleSelect],
    )

    // useMemo: Ghi nhớ kết quả định dạng ngày tháng để tránh tính toán lại liên tục khi render
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
          selected && 'ring-2 ring-primary/50 border-primary/30 bg-primary/5',
        )}
      >
        {/* Checkbox chọn nhiều (Multi-select) - Bên trái, hình vuông */}
        <button
          type="button"
          onClick={handleSelectionToggle}
          className="shrink-0 mt-0.5 md:mt-0"
          title={selected ? 'Bỏ chọn' : 'Chọn để thao tác hàng loạt'}
        >
          <div
            className={cn(
              'size-5 md:size-5 rounded border-2 flex items-center justify-center transition-colors',
              selected
                ? 'bg-primary border-primary'
                : 'border-slate-300 dark:border-slate-500 hover:border-primary/60',
            )}
          >
            {selected && (
              <span className="material-symbols-outlined text-white text-[12px]">
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

        {/* Action Buttons + Complete Toggle - Bên phải */}
        {!isEditing && (
          <div
            className={cn(
              'flex items-center gap-1 shrink-0',
              viewMode === 'board' &&
                'w-full justify-end mt-2 pt-2 border-t border-slate-100 dark:border-slate-700',
            )}
          >
            {/* Nút Hoàn thành/Chưa hoàn thành - Bên phải, hình tròn */}
            <button
              type="button"
              onClick={handleToggle}
              className={cn(
                'p-1.5 rounded-lg transition-colors',
                todo.completed
                  ? 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                  : 'text-slate-400 hover:text-emerald-500 hover:bg-slate-100 dark:hover:bg-slate-700',
              )}
              title={
                todo.completed
                  ? 'Đánh dấu chưa hoàn thành'
                  : 'Đánh dấu hoàn thành'
              }
            >
              <span className="material-symbols-outlined text-[20px]">
                {todo.completed ? 'task_alt' : 'radio_button_unchecked'}
              </span>
            </button>

            {/* Divider */}
            <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-0.5 md:opacity-0 md:group-hover:opacity-100 transition-opacity" />

            {/* Edit button */}
            <button
              type="button"
              onClick={handleEdit}
              className="p-1.5 text-slate-400 hover:text-primary rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
              title="Chỉnh sửa"
            >
              <span className="material-symbols-outlined text-[18px]">
                edit
              </span>
            </button>

            {/* Delete button */}
            <button
              type="button"
              onClick={handleDelete}
              className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
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
