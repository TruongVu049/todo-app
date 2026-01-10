import { useState } from 'react';
import { nanoid } from 'nanoid';
import { TodoLocal } from '@/types/todo';
import { TodoForm, TodoList } from '@/components/todo-challenge';
import { Head } from '@/components/seo';
import { initialTodos } from './mock-data';

/**
 * TodoChallengePage - Trang chính quản lý todos
 * 
 * Pattern: "Lifting State Up"
 * - State todos nằm ở đây (component cha)
 * - Các handlers được truyền xuống components con qua props
 */
const TodoChallengePage = () => {
  // STATE: Danh sách todos, khởi tạo từ mock-data
  const [todos, setTodos] = useState<TodoLocal[]>(initialTodos);

  /**
   * Handler: Thêm todo mới
   * - Được truyền xuống TodoForm qua prop onSubmit
   * - THAY ĐỔI: Trước là onAdd, giờ là onSubmit (để TodoForm tái sử dụng)
   */
  const handleAdd = (text: string) => {
    const newTodo: TodoLocal = {
      id: nanoid(),           // Tạo ID unique
      text,                   // Nội dung từ form
      createdAt: Date.now(),  // Timestamp hiện tại
    };
    setTodos((prev) => [...prev, newTodo]); // Thêm vào cuối mảng
  };

  /**
   * Handler: Sửa todo
   * - Được truyền xuống TodoList → TodoItem
   */
  const handleEdit = (id: string, text: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id 
          ? { ...todo, text, updatedAt: Date.now() } // Cập nhật todo khớp id
          : todo // Giữ nguyên todo khác
      )
    );
  };

  /**
   * Handler: Xóa todo
   * - Được truyền xuống TodoList → TodoItem
   */
  const handleDelete = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  return (
    <>
      <Head description="Todo Challenge - Quản lý công việc" />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Todo Challenge
        </h1>
        
        {/* 
          TodoForm cho ADD mode
          - THAY ĐỔI: onAdd → onSubmit (để form tái sử dụng được)
          - Không có initialText = add mode
        */}
        <TodoForm onSubmit={handleAdd} />
        
        {/* TodoList hiển thị danh sách */}
        <TodoList todos={todos} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
    </>
  );
};

export default TodoChallengePage;
