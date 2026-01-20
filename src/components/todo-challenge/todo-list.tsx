import { memo } from 'react';
import { TodoLocal } from '@/types/todo';
import { TodoItem } from './todo-item';

type TodoListProps = {
  todos: TodoLocal[];
  onEdit: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  onToggleSelect: (id: string) => void;
  onToggleComplete: (id: string) => void;
};

/**
 * TodoList Component - Sử dụng memo để tránh re-render không cần thiết
 */
export const TodoList = memo(function TodoList({
  todos,
  onEdit,
  onDelete,
  onToggleSelect,
  onToggleComplete,
}: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8 bg-white rounded-lg border border-gray-200">
        Không có todo nào
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleSelect={onToggleSelect}
          onToggleComplete={onToggleComplete}
        />
      ))}
    </div>
  );
});
