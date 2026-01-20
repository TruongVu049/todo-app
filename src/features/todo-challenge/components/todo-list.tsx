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
    const parentRef = useRef<HTMLDivElement>(null) // Tạo ref để theo dõi element bao bọc danh sách (cần thiết cho virtualizer)

    const virtualizer = useVirtualizer({
      count: todos.length, // Tổng số lượng item trong danh sách
      getScrollElement: () => parentRef.current, // Chỉ định element nào sẽ thực hiện việc scroll
      estimateSize: () => 80, // Ước tính chiều cao mỗi item (80px) để tính toán tổng diện tích scroll
      overscan: 5, // Render thêm 5 item phía trên/dưới vùng nhìn thấy để scroll mượt hơn
    })

    if (todos.length === 0) {
      return (
        <div className="text-center py-12 bg-white dark:bg-[#1e2736] rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
          <p className="text-slate-500">No todos</p>
        </div>
      )
    }

    // Nếu không phải chế độ xem danh sách (List View), chúng ta render bình thường vì virtualization phức tạp với Grid/Board
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
        ref={parentRef} // Gán ref vào div chứa scroll
        className="max-h-[600px] overflow-auto pr-2 custom-scrollbar"
      >
        <div
          className="relative w-full"
          style={{ height: `${virtualizer.getTotalSize()}px` }} // Thiết lập tổng chiều cao thực tế dựa trên số lượng item
        >
          {virtualizer.getVirtualItems().map((virtualItem) => {
            const todo = todos[virtualItem.index] // Lấy đúng todo data dựa trên index đang được virtualizer chỉ định
            return (
              <div
                key={virtualItem.key}
                className="absolute top-0 left-0 w-full" // Sử dụng absolute để đặt item đúng vị trí trong vùng scroll
                style={{
                  height: `${virtualItem.size}px`, // Chiều cao item
                  transform: `translateY(${virtualItem.start}px)`, // Đẩy item xuống đúng vị trí pixel dựa trên index
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
