import * as React from 'react'

import { cn } from '@/utils/cn'

import { useHistoryStore } from '../history-store'
import { useUpdateTodo, useDeleteTodo } from '../hooks'
import { useTodoStore, getProjectInfo } from '../store'
import type { Todo } from '../types'

import { DeleteConfirmationDialog } from './delete-confirmation-dialog'
import { TaskDetailModal } from './task-detail-modal'

interface TodoItemProps {
  todo: Todo
}

// Check if a date is overdue (before today)
const isOverdue = (dueDate: string) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (dueDate === 'today' || dueDate === 'tomorrow') return false

  try {
    const due = new Date(dueDate)
    due.setHours(0, 0, 0, 0)
    return due < today
  } catch {
    return false
  }
}

// Get time display based on due date
const getTimeDisplay = (dueDate: string, completed: boolean) => {
  if (completed) return 'Hoàn thành'
  if (dueDate === 'today') return 'Hôm nay'
  if (dueDate === 'tomorrow') return 'Ngày mai'

  // Check if overdue
  if (isOverdue(dueDate)) {
    const due = new Date(dueDate)
    const today = new Date()
    const diffTime = today.getTime() - due.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return `Quá hạn ${diffDays} ngày`
  }

  // Format date for future dates
  try {
    const date = new Date(dueDate)
    return date.toLocaleDateString('vi-VN', { day: 'numeric', month: 'short' })
  } catch {
    return dueDate
  }
}

export function TodoItem({ todo }: TodoItemProps) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [editText, setEditText] = React.useState(todo.todo)
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)
  const [showDetailModal, setShowDetailModal] = React.useState(false)

  const updateTodo = useUpdateTodo()
  const deleteTodo = useDeleteTodo()
  const { getTodoMetadata, updateLocalTodo, deleteLocalTodo } = useTodoStore()
  const recordAction = useHistoryStore((s) => s.recordAction)

  const isUpdating = updateTodo.isPending
  const isDeleting = deleteTodo.isPending

  // Get metadata from store or todo itself
  const metadata = getTodoMetadata(todo.id)
  const project = todo.project || metadata?.project || 'personal'
  const dueDate = todo.dueDate || metadata?.dueDate || 'today'
  const priority = todo.priority || metadata?.priority || 'medium'

  const projectInfo = getProjectInfo(project)
  const timeDisplay = getTimeDisplay(dueDate, todo.completed)
  const overdueStatus = !todo.completed && isOverdue(dueDate)

  const handleToggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Try to update local todo first
    if (todo.createdAt) {
      updateLocalTodo(todo.id, { completed: !todo.completed })
    } else {
      updateTodo.mutate({
        id: todo.id,
        data: { completed: !todo.completed },
      })
    }
  }

  const handleSaveEdit = () => {
    if (!editText.trim() || editText.trim() === todo.todo) {
      setEditText(todo.todo)
      setIsEditing(false)
      return
    }

    if (todo.createdAt) {
      updateLocalTodo(todo.id, { todo: editText.trim() })
      setIsEditing(false)
    } else {
      updateTodo.mutate(
        {
          id: todo.id,
          data: { todo: editText.trim() },
        },
        {
          onSuccess: () => setIsEditing(false),
        },
      )
    }
  }

  const handleCancelEdit = () => {
    setEditText(todo.todo)
    setIsEditing(false)
  }

  const handleDelete = () => {
    // Record action for undo
    recordAction({
      type: 'delete',
      todoId: todo.id,
      previousState: { ...todo },
    })

    if (todo.createdAt) {
      deleteLocalTodo(todo.id)
      setShowDeleteDialog(false)
    } else {
      deleteTodo.mutate(todo.id, {
        onSuccess: () => setShowDeleteDialog(false),
      })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit()
    } else if (e.key === 'Escape') {
      handleCancelEdit()
    }
  }

  const handleCardClick = () => {
    if (!isEditing) {
      setShowDetailModal(true)
    }
  }

  const handleUpdate = (id: number, updates: Partial<Todo>) => {
    if (todo.createdAt) {
      updateLocalTodo(id, updates)
    } else {
      updateTodo.mutate({ id, data: updates })
    }
  }

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={handleCardClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleCardClick(e as unknown as React.MouseEvent)
          }
        }}
        className={cn(
          'group flex items-center gap-4 px-4 py-3.5 bg-white dark:bg-[#1e2736] rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary/30 hover:shadow-md cursor-pointer',
          todo.completed && 'bg-slate-50 dark:bg-slate-800/50',
          (isUpdating || isDeleting) && 'pointer-events-none opacity-60',
        )}
      >
        {/* Circular Checkbox */}
        <button
          onClick={handleToggleComplete}
          disabled={isUpdating || isDeleting}
          className="relative flex items-center justify-center shrink-0"
        >
          <div
            className={cn(
              'size-[22px] rounded-full border-2 flex items-center justify-center',
              todo.completed
                ? 'bg-primary border-primary'
                : 'border-slate-300 dark:border-slate-500 hover:border-primary/60',
            )}
          >
            {todo.completed && (
              <span className="material-symbols-outlined text-white text-[14px]">
                check
              </span>
            )}
          </div>
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0 flex items-center gap-3">
          {isEditing ? (
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              onClick={(e) => e.stopPropagation()}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              className="flex-1 rounded-lg border border-primary/50 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          ) : (
            <>
              <span
                className={cn(
                  'text-[15px] text-slate-800 dark:text-slate-200 font-medium truncate',
                  todo.completed &&
                    'text-slate-400 dark:text-slate-500 line-through',
                )}
              >
                {todo.todo}
              </span>

              {/* Project Tag */}
              <span
                className={cn(
                  'shrink-0 inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border',
                  project === 'work' &&
                    'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
                  project === 'personal' &&
                    'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
                  project === 'shopping' &&
                    'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800',
                  !['work', 'personal', 'shopping'].includes(project) &&
                    'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:border-slate-600',
                  todo.completed && 'opacity-50',
                )}
              >
                # {projectInfo.name}
              </span>

              {/* Priority Indicator */}
              {!todo.completed && (
                <span
                  className={cn(
                    'text-[10px] font-medium px-1.5 py-0.5 rounded',
                    priority === 'high' && 'bg-red-100 text-red-600',
                    priority === 'medium' && 'bg-orange-100 text-orange-600',
                    priority === 'low' && 'bg-blue-100 text-blue-600',
                  )}
                  title={`Độ ưu tiên: ${priority === 'high' ? 'Cao' : priority === 'medium' ? 'Trung bình' : 'Thấp'}`}
                >
                  {priority === 'high'
                    ? '🔴 Cao'
                    : priority === 'medium'
                      ? '🟡 TB'
                      : '🔵 Thấp'}
                </span>
              )}
            </>
          )}
        </div>

        {/* Time/Due Date */}
        {!isEditing && (
          <span
            className={cn(
              'text-xs font-medium whitespace-nowrap flex items-center gap-1',
              todo.completed
                ? 'text-emerald-500'
                : overdueStatus
                  ? 'text-red-600 bg-red-50 px-2 py-1 rounded-lg border border-red-200'
                  : dueDate === 'today'
                    ? 'text-primary'
                    : 'text-orange-500',
            )}
          >
            {overdueStatus && (
              <span className="material-symbols-outlined text-[14px]">
                warning
              </span>
            )}
            {timeDisplay}
          </span>
        )}

        {/* Action Buttons */}
        <div
          className={cn(
            'flex items-center gap-0.5',
            isEditing ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
          )}
        >
          {isEditing ? (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleSaveEdit()
                }}
                disabled={isUpdating}
                className="p-1.5 text-emerald-600 hover:text-emerald-700 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                title="Lưu"
              >
                <span className="material-symbols-outlined text-[18px]">
                  check
                </span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleCancelEdit()
                }}
                disabled={isUpdating}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                title="Hủy"
              >
                <span className="material-symbols-outlined text-[18px]">
                  close
                </span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsEditing(true)
                }}
                disabled={isUpdating || isDeleting}
                className="p-1.5 text-slate-400 hover:text-primary rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                title="Chỉnh sửa"
              >
                <span className="material-symbols-outlined text-[18px]">
                  edit
                </span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowDeleteDialog(true)
                }}
                disabled={isUpdating || isDeleting}
                className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                title="Xóa"
              >
                <span className="material-symbols-outlined text-[18px]">
                  delete
                </span>
              </button>
            </>
          )}
        </div>
      </div>

      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        todoText={todo.todo}
      />

      <TaskDetailModal
        open={showDetailModal}
        onOpenChange={setShowDetailModal}
        todo={todo}
        onUpdate={handleUpdate}
      />
    </>
  )
}
