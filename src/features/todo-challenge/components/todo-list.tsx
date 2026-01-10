import { useVirtualizer } from '@tanstack/react-virtual'
import React, { memo, useRef } from 'react'

import type { ViewMode } from '@/types/common'

import { useTodoActions } from '../context'
import type { Todo } from '../types'

import { TodoItem } from './todo-item'

interface TodoListProps {
  todos: Todo[]
  viewMode: ViewMode
  className?: string
}

export const TodoList: React.FC<TodoListProps> = memo(
  ({ todos, viewMode, className }) => {
    const { updateTodo, openDeleteModal, toggleComplete } = useTodoActions()
    const parentRef = useRef<HTMLDivElement>(null)

    const virtualizer = useVirtualizer({
      count: todos.length,
      getScrollElement: () => parentRef.current,
      estimateSize: () => 80,
      overscan: 5,
    })

    if (todos.length === 0) {
      return (
        <div className="text-center py-12 bg-white dark:bg-[#1e2736] rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
          <p className="text-slate-500">No todos</p>
        </div>
      )
    }

    if (viewMode !== 'list') {
      return (
        <div className={className}>
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              viewMode={viewMode}
              onUpdate={updateTodo}
              onDelete={openDeleteModal}
              onToggleComplete={toggleComplete}
            />
          ))}
        </div>
      )
    }

    return (
      <div
        ref={parentRef}
        className="max-h-[600px] overflow-auto pr-2 custom-scrollbar"
      >
        <div
          className="relative w-full"
          style={{ height: `${virtualizer.getTotalSize()}px` }}
        >
          {virtualizer.getVirtualItems().map((virtualItem) => {
            const todo = todos[virtualItem.index]
            return (
              <div
                key={virtualItem.key}
                className="absolute top-0 left-0 w-full"
                style={{
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                <div className="pb-3">
                  <TodoItem
                    todo={todo}
                    viewMode={viewMode}
                    onUpdate={updateTodo}
                    onDelete={openDeleteModal}
                    onToggleComplete={toggleComplete}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  },
)

TodoList.displayName = 'TodoList'
