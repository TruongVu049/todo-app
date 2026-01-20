import { useState, useRef, useEffect, useCallback, memo } from 'react';
import { Button } from '@/components/ui/button';

// Custom debounce function (thay vì dùng lodash-es)
function debounce<T extends (...args: Parameters<T>) => void>(
  func: T,
  wait: number
): T & { cancel: () => void } {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), wait);
  };

  debounced.cancel = () => {
    if (timeoutId) clearTimeout(timeoutId);
  };

  return debounced as T & { cancel: () => void };
}

/**
 * Hàm validate text của todo - EXPORT để dùng chung
 */
export const validateTodoText = (value: string): string | null => {
  const trimmed = value.trim();
  if (!trimmed) return 'Không được để trống';
  if (trimmed.length < 3) return 'Tối thiểu 3 ký tự';
  return null;
};

type TodoFormProps = {
  initialText?: string;
  onSubmit: (text: string) => void;
  onCancel?: () => void;
  submitLabel?: string;
  placeholder?: string;
  onTextChange?: (text: string) => void; // Callback debounced khi text thay đổi
};

/**
 * TodoForm Component - DÙNG CHUNG CHO CẢ ADD VÀ EDIT
 * Sử dụng memo để tránh re-render không cần thiết
 * Sử dụng debounce cho input
 */
export const TodoForm = memo(function TodoForm({
  initialText = '',
  onSubmit,
  onCancel,
  submitLabel = 'Thêm',
  placeholder = 'Nhập công việc mới...',
  onTextChange,
}: TodoFormProps) {
  const [text, setText] = useState(initialText);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced callback - gọi sau 300ms khi user ngừng gõ
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedOnChange = useCallback(
    debounce((value: string) => {
      onTextChange?.(value);
      // Validate sau khi debounce
      const validationError = validateTodoText(value);
      if (value && validationError) {
        setError(validationError);
      }
    }, 300),
    [onTextChange]
  );

  // Cleanup debounce khi unmount
  useEffect(() => {
    return () => {
      debouncedOnChange.cancel();
    };
  }, [debouncedOnChange]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  // useCallback: Xử lý thay đổi input
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setText(value);
      if (error) setError('');
      debouncedOnChange(value);
    },
    [error, debouncedOnChange]
  );

  // useCallback: Xử lý submit
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const validationError = validateTodoText(text);
      if (validationError) {
        setError(validationError);
        return;
      }
      onSubmit(text.trim());
      if (!initialText) {
        setText('');
      }
      setError('');
      inputRef.current?.focus();
    },
    [text, initialText, onSubmit]
  );

  // useCallback: Xử lý hủy
  const handleCancel = useCallback(() => {
    setText(initialText);
    setError('');
    onCancel?.();
  }, [initialText, onCancel]);

  const isEditMode = !!initialText;

  return (
    <form onSubmit={handleSubmit} className={isEditMode ? '' : 'flex gap-3 mb-6'}>
      <div className={isEditMode ? '' : 'flex-1'}>
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
      <div className={isEditMode ? 'flex gap-2 mt-3' : ''}>
        <Button type="submit" size={isEditMode ? 'sm' : 'default'}>
          {submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" size="sm" onClick={handleCancel}>
            Hủy
          </Button>
        )}
      </div>
    </form>
  );
});
