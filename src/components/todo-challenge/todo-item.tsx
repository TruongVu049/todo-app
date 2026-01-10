import { useState } from 'react';
import { TodoLocal } from '@/types/todo';
import { Button } from '@/components/ui/button';
import { PencilIcon, TrashIcon } from 'lucide-react';
import { TodoForm } from './todo-form';

type TodoItemProps = {
  todo: TodoLocal;
  onEdit: (id: string, text: string) => void;
  onDelete: (id: string) => void;
};

export function TodoItem({ todo, onEdit, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (text: string) => {
    onEdit(todo.id, text);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Bạn có chắc muốn xóa todo này?')) {
      onDelete(todo.id);
    }
  };

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
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm flex justify-between items-center">
      <span className="flex-1 text-gray-900">{todo.text}</span>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsEditing(true)}
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
}
