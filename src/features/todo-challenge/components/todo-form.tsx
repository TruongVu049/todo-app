import React, { memo, useRef } from 'react'

import { TodoInput, type TodoInputHandle } from './todo-input'

interface TodoFormProps {
  initialDate: string
  onSubmit: (text: string, date?: string) => void
}

export const TodoForm: React.FC<TodoFormProps> = memo(
  ({ initialDate, onSubmit }) => {
    // Ref để truy cập vào các phương thức công khai của TodoInput (ví dụ hàm submit)
    const todoInputRef = useRef<TodoInputHandle>(null)

    return (
      <div className="bg-white dark:bg-[#1e2736] p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Thành phần nhập liệu Todo, mode="create" để tạo mới */}
          <TodoInput
            ref={todoInputRef} // Gán ref để nút "Add" bên ngoài có thể kích hoạt lưu
            mode="create"
            initialDate={initialDate}
            onSave={onSubmit}
            showDatePicker={true}
          />
          <button
            type="button"
            // Khi click nút Add, gọi hàm submit() ẩn bên trong TodoInput thông qua ref
            onClick={() => todoInputRef.current?.submit()}
            className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">add</span>
            <span>Add</span>
          </button>
        </div>
      </div>
    )
  },
)

TodoForm.displayName = 'TodoForm'
