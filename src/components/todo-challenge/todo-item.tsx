import { useState, useCallback, memo } from 'react';
import { TodoLocal } from '@/types/todo';
import { Button } from '@/components/ui/button';
import { PencilIcon, TrashIcon, Check } from 'lucide-react';
import { TodoForm } from './todo-form';

type TodoItemProps = {
  todo: TodoLocal;
  onEdit: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  onToggleSelect: (id: string) => void;
  onToggleComplete: (id: string) => void;
};

/**
 * TodoItem Component - Sử dụng memo để tránh re-render không cần thiết
 */
export const TodoItem = memo(function TodoItem({
  todo,
  onEdit,
  onDelete,
  onToggleSelect,
  onToggleComplete,
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);

  // useCallback: Xử lý lưu
  const handleSave = useCallback(
    (text: string) => {
      onEdit(todo.id, text);
      setIsEditing(false);
    },
    [todo.id, onEdit]
  );

  // useCallback: Xử lý hủy
  const handleCancel = useCallback(() => {
    setIsEditing(false);
  }, []);

  // useCallback: Xử lý xóa
  const handleDelete = useCallback(() => {
    if (window.confirm('Bạn có chắc muốn xóa todo này?')) {
      onDelete(todo.id);
    }
  }, [todo.id, onDelete]);

  // useCallback: Toggle select
  const handleToggleSelect = useCallback(() => {
    onToggleSelect(todo.id);
  }, [todo.id, onToggleSelect]);

  // useCallback: Toggle complete
  const handleToggleComplete = useCallback(() => {
    onToggleComplete(todo.id);
  }, [todo.id, onToggleComplete]);

  // useCallback: Bắt đầu edit
  const handleStartEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  if (isEditing) {
    return (
      <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <TodoForm
          initialText={todo.text}
          onSubmit={handleSave}
          onCancel={handleCancel}
          submitLabel="Lưu"
          placeholder="Sửa công việc..."
        />
      </div>
    );
  }

  return (
    <div
      className={`p-4 bg-white border rounded-lg shadow-sm flex items-center gap-3 ${
        todo.selected ? 'border-blue-400 bg-blue-50' : 'border-gray-200'
      }`}
    >
      {/* Checkbox select */}
      <input
        type="checkbox"
        checked={todo.selected || false}
        onChange={handleToggleSelect}
        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
      />

      {/* Complete button */}
      <button
        onClick={handleToggleComplete}
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
          todo.completed
            ? 'bg-green-500 border-green-500 text-white'
            : 'border-gray-300 hover:border-green-400'
        }`}
      >
        {todo.completed && <Check className="w-4 h-4" />}
      </button>

      {/* Text */}
      <span className={`flex-1 ${todo.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
        {todo.text}
      </span>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleStartEdit}
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        >
          <PencilIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <TrashIcon className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
});
