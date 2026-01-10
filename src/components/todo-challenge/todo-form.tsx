import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';

/**
 * Hàm validate text của todo - EXPORT để dùng chung
 * @param value - Giá trị cần validate
 * @returns Chuỗi lỗi nếu không hợp lệ, null nếu hợp lệ
 */
export const validateTodoText = (value: string): string | null => {
  const trimmed = value.trim(); // Xóa khoảng trắng đầu/cuối
  if (!trimmed) return 'Không được để trống';
  if (trimmed.length < 3) return 'Tối thiểu 3 ký tự';
  return null; // null = hợp lệ
};

/**
 * Props cho TodoForm - THIẾT KẾ ĐỂ TÁI SỬ DỤNG
 * - Không có initialText = ADD mode (thêm mới)
 * - Có initialText = EDIT mode (chỉnh sửa)
 */
type TodoFormProps = {
  initialText?: string;           // Text ban đầu (có = edit, không có = add)
  onSubmit: (text: string) => void; // Callback khi submit (thay cho onAdd cũ)
  onCancel?: () => void;          // Callback khi hủy (chỉ cần cho edit mode)
  submitLabel?: string;           // Label nút submit ("Thêm" hoặc "Lưu")
  placeholder?: string;           // Placeholder cho input
};

/**
 * TodoForm Component - DÙNG CHUNG CHO CẢ ADD VÀ EDIT
 *
 * Ví dụ sử dụng:
 * - Add mode:  <TodoForm onSubmit={handleAdd} />
 * - Edit mode: <TodoForm initialText="abc" onSubmit={handleSave} onCancel={handleCancel} submitLabel="Lưu" />
 */
export function TodoForm({
  initialText = '',              // Mặc định rỗng = add mode
  onSubmit,
  onCancel,
  submitLabel = 'Thêm',          // Mặc định "Thêm" cho add mode
  placeholder = 'Nhập công việc mới...',
}: TodoFormProps) {
  // STATE: Nội dung input, khởi tạo từ initialText
  const [text, setText] = useState(initialText);
  // STATE: Thông báo lỗi validation
  const [error, setError] = useState('');
  // REF: Tham chiếu đến input element để focus
  const inputRef = useRef<HTMLInputElement>(null);

  // EFFECT: Auto-focus input khi component mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // EFFECT: Sync text với initialText khi prop thay đổi
  // Cần thiết khi edit nhiều todo khác nhau
  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  /**
   * Xử lý submit form
   * - Validate input
   * - Gọi callback onSubmit
   * - Reset form nếu là add mode
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Ngăn form reload trang

    const validationError = validateTodoText(text);
    if (validationError) {
      setError(validationError);
      return; // Dừng, không submit
    }

    onSubmit(text.trim()); // Gọi callback từ parent

    // CHỈ reset nếu là ADD mode (không có initialText)
    // Edit mode giữ nguyên text sau khi save
    if (!initialText) {
      setText('');
    }
    setError('');
    inputRef.current?.focus(); // Focus lại input
  };

  /**
   * Xử lý hủy edit
   * - Reset text về giá trị ban đầu
   * - Gọi callback onCancel
   */
  const handleCancel = () => {
    setText(initialText); // Reset về text gốc
    setError('');
    onCancel?.(); // Gọi callback nếu có (optional chaining)
  };

  // Xác định mode để render UI khác nhau
  const isEditMode = !!initialText; // !! convert sang boolean

  return (
    // CLASS KHÁC NHAU: Add mode = flex row, Edit mode = stack
    <form onSubmit={handleSubmit} className={isEditMode ? '' : 'flex gap-3 mb-6'}>
      <div className={isEditMode ? '' : 'flex-1'}>
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (error) setError(''); // Xóa error khi user bắt đầu gõ
          }}
          placeholder={placeholder}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {/* Hiển thị lỗi validation */}
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>

      {/* BUTTONS: Edit mode có thêm nút Hủy */}
      <div className={isEditMode ? 'flex gap-2 mt-3' : ''}>
        <Button type="submit" size={isEditMode ? 'sm' : 'default'}>
          {submitLabel} {/* "Thêm" hoặc "Lưu" tùy mode */}
        </Button>
        {/* Chỉ hiện nút Hủy khi có onCancel (edit mode) */}
        {onCancel && (
          <Button type="button" variant="outline" size="sm" onClick={handleCancel}>
            Hủy
          </Button>
        )}
      </div>
    </form>
  );
}
