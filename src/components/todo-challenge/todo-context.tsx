import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { nanoid } from 'nanoid';
import { TodoLocal, FilterTab } from '@/types/todo';
import { initialTodos } from '@/app/routes/todo-challenge/mock-data';

// Types
type TodoContextType = {
  todos: TodoLocal[];
  filteredTodos: TodoLocal[];
  activeTab: FilterTab;
  stats: { total: number; completed: number; active: number; selected: number };
  setActiveTab: (tab: FilterTab) => void;
  addTodo: (text: string) => void;
  editTodo: (id: string, text: string) => void;
  deleteTodo: (id: string) => void;
  toggleSelect: (id: string) => void;
  toggleComplete: (id: string) => void;
  selectAll: () => void;
  unselectAll: () => void;
  deleteSelected: () => void;
  completeSelected: () => void;
};

// Context
const TodoContext = createContext<TodoContextType | null>(null);

// Provider
export function TodoProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<TodoLocal[]>(initialTodos);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  // useMemo: Tính toán stats
  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((t) => t.completed).length;
    const active = total - completed;
    const selected = todos.filter((t) => t.selected).length;
    return { total, completed, active, selected };
  }, [todos]);

  // useMemo: Lọc todos theo tab
  const filteredTodos = useMemo(() => {
    switch (activeTab) {
      case 'completed':
        return todos.filter((t) => t.completed);
      case 'active':
        return todos.filter((t) => !t.completed);
      default:
        return todos;
    }
  }, [todos, activeTab]);

  // useCallback: Thêm todo
  const addTodo = useCallback((text: string) => {
    const newTodo: TodoLocal = {
      id: nanoid(),
      text,
      createdAt: Date.now(),
      completed: false,
      selected: false,
    };
    setTodos((prev) => [...prev, newTodo]);
  }, []);

  // useCallback: Sửa todo
  const editTodo = useCallback((id: string, text: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, text, updatedAt: Date.now() } : todo
      )
    );
  }, []);

  // useCallback: Xóa todo
  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }, []);

  // useCallback: Toggle select
  const toggleSelect = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, selected: !todo.selected } : todo
      )
    );
  }, []);

  // useCallback: Toggle complete
  const toggleComplete = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  // useCallback: Chọn tất cả
  const selectAll = useCallback(() => {
    setTodos((prev) => prev.map((todo) => ({ ...todo, selected: true })));
  }, []);

  // useCallback: Bỏ chọn tất cả
  const unselectAll = useCallback(() => {
    setTodos((prev) => prev.map((todo) => ({ ...todo, selected: false })));
  }, []);

  // useCallback: Xóa các todo đã chọn
  const deleteSelected = useCallback(() => {
    setTodos((prev) => prev.filter((todo) => !todo.selected));
  }, []);

  // useCallback: Hoàn thành các todo đã chọn
  const completeSelected = useCallback(() => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.selected ? { ...todo, completed: true } : todo
      )
    );
  }, []);

  const value = useMemo(
    () => ({
      todos,
      filteredTodos,
      activeTab,
      stats,
      setActiveTab,
      addTodo,
      editTodo,
      deleteTodo,
      toggleSelect,
      toggleComplete,
      selectAll,
      unselectAll,
      deleteSelected,
      completeSelected,
    }),
    [todos, filteredTodos, activeTab, stats, addTodo, editTodo, deleteTodo, toggleSelect, toggleComplete, selectAll, unselectAll, deleteSelected, completeSelected]
  );

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}

// Custom hook để sử dụng context
export function useTodoContext() {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodoContext must be used within TodoProvider');
  }
  return context;
}
