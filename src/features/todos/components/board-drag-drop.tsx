import { useDroppable, useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import * as React from 'react'

import { cn } from '@/utils/cn'

import { getProjectInfo } from '../store'
import type { Todo } from '../types'

interface DroppableColumnProps {
  id: string
  title: string
  todos: Todo[]
  getTodoProject: (todo: Todo) => string
  color: {
    bg: string
    dot: string
    badge: string
    border: string
  }
  emptyText?: string
  totalCount?: number // Optional: use this for badge if todos is sliced
}

interface DraggableBoardItemProps {
  todo: Todo
  project: { name: string; color: string }
  borderColor?: string
  isCompleted?: boolean
}

// Droppable Column for Board View
export function DroppableColumn({
  id,
  title,
  todos,
  getTodoProject,
  color,
  emptyText = 'Không có công việc',
  totalCount,
}: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id })

  // Use totalCount if provided, otherwise use todos.length
  const displayCount = totalCount ?? todos.length

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'rounded-xl p-4 min-h-[200px] transition-all',
        color.bg,
        isOver && 'ring-2 ring-primary ring-offset-2',
      )}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className={cn('w-3 h-3 rounded-full', color.dot)}></span>
        <h3 className="font-semibold text-slate-900 dark:text-white">
          {title}
        </h3>
        <span
          className={cn(
            'ml-auto text-xs px-2 py-0.5 rounded-full',
            color.badge,
          )}
        >
          {displayCount}
        </span>
      </div>
      <div className="space-y-2">
        {todos.map((todo) => {
          const project = getProjectInfo(getTodoProject(todo))
          return (
            <DraggableBoardItem
              key={todo.id}
              todo={todo}
              project={project}
              borderColor={color.border}
              isCompleted={todo.completed}
            />
          )
        })}
        {todos.length === 0 && (
          <p className="text-xs text-slate-400 text-center py-8">{emptyText}</p>
        )}
      </div>
    </div>
  )
}

// Draggable Item for Board View - using useDraggable for cross-column drag
export function DraggableBoardItem({
  todo,
  project,
  borderColor = 'border-slate-200 dark:border-slate-700',
  isCompleted = false,
}: DraggableBoardItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: todo.id })

  const style: React.CSSProperties = {
    transform: transform ? CSS.Translate.toString(transform) : undefined,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 1,
    position: 'relative',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        'bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm border cursor-grab active:cursor-grabbing touch-none',
        borderColor,
        isDragging && 'ring-2 ring-primary shadow-lg',
        isCompleted && 'opacity-75',
      )}
    >
      <p
        className={cn(
          'text-sm text-slate-800 dark:text-white mb-2',
          isCompleted && 'text-slate-500 line-through',
        )}
      >
        {todo.todo}
      </p>
      {!isCompleted && (
        <span
          className={cn('text-[10px] px-1.5 py-0.5 rounded', project.color)}
        >
          # {project.name}
        </span>
      )}
    </div>
  )
}
