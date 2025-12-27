import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import * as React from 'react'

import { cn } from '@/utils/cn'

import type { Todo } from '../types'

import { TodoItem } from './todo-item'

interface SortableTodoItemProps {
  todo: Todo
  isDraggingOver?: boolean
}

export function SortableTodoItem({
  todo,
  isDraggingOver,
}: SortableTodoItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center gap-2 group/sortable',
        isDragging && 'ring-2 ring-primary ring-offset-2 rounded-xl',
        isDraggingOver && 'ring-1 ring-primary/30 rounded-xl',
      )}
    >
      {/* Drag Handle - inline before the todo item */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 opacity-50 hover:opacity-100 transition-opacity"
      >
        <span className="material-symbols-outlined text-[18px] text-slate-400 dark:text-slate-500">
          drag_indicator
        </span>
      </div>

      <div className="flex-1">
        <TodoItem todo={todo} />
      </div>
    </div>
  )
}
