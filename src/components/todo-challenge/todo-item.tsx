import { useState } from 'react';
import { TodoLocal } from '@/types/todo';
import { Button } from '@/components/ui/button';
import { PencilIcon, TrashIcon } from 'lucide-react';
// IMPORT TodoForm để tái sử dụng cho edit mode
import { TodoForm } from './todo-form';

type TodoItemProps = {
  todo: TodoLocal;
  onEdit: (id: string, text: string) => void;
  onDelete: (id: string) => void;
};

/**
 * TodoItem Component - Hiển thị 1 todo
 * 
 * REFACTORED: Giờ dùng TodoForm cho edit mode
 * - Trước: ~90 dòng (có duplicate validate, state, useEffect)
 * - Sau: ~50 dòng (tái sử dụng TodoForm)
 */
export function TodoItem({ todo, onEdit, onDelete }: TodoItemProps) {
  // CHỈ CÒN 1 STATE: Đang edit hay không
  // ĐÃ XÓA: editText, error, inputRef, useEffect, validate()
  const [isEditing, setIsEditing] = useState(false);

  /**
   * Xử lý lưu khi edit xong
   * - Gọi onEdit callback từ parent
   * - Thoát chế độ edit
   */
  const handleSave = (text: string) => {
    onEdit(todo.id, text);
    setIsEditing(false);
  };

  /**
   * Xử lý hủy edit
   * - Chỉ cần thoát chế độ edit
   * - TodoForm tự reset text về initialText
   */
  const handleCancel = () => {
    setIsEditing(false);
  };

  /**
   * Xử lý xóa với confirm dialog
   */
  const handleDelete = () => {
    if (window.confirm('Bạn có chắc muốn xóa todo này?')) {
      onDelete(todo.id);
    }
  };

  // ========== RENDER: CHẾ ĐỘ EDIT ==========
  // TÁI SỬ DỤNG TodoForm thay vì viết lại input, validate, error...
  if (isEditing) {
    return (
      <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        {/* 
          SỬ DỤNG LẠI TodoForm với các props:
          - initialText: Text hiện tại của todo (bật edit mode)
          - onSubmit: Callback khi user click "Lưu"
          - onCancel: Callback khi user click "Hủy"
          - submitLabel: Đổi label từ "Thêm" thành "Lưu"
        */}
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

  // ========== RENDER: CHẾ ĐỘ XEM (mặc định) ==========
  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm flex justify-between items-center">
      {/* Nội dung todo */}
      <span className="flex-1 text-gray-900">{todo.text}</span>
      
      {/* Nút Edit và Delete */}
      <div className="flex gap-2">
        {/* Nút Edit - bật chế độ edit */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsEditing(true)}
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        >
          <PencilIcon className="w-4 h-4" />
        </Button>
        {/* Nút Delete - xóa với confirm */}
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
