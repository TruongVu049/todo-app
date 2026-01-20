import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react'

import type { Todo } from '../types'

interface TodoContextType {
  todos: Todo[]
  isDeleteModalOpen: boolean
  todoToDelete: Todo | null

  todayCount: number
  tomorrowCount: number
  overdueCount: number
  completedCount: number
  totalCount: number

  addTodo: (text: string, date: string) => void
  updateTodo: (id: string, newText: string) => void
  toggleComplete: (id: string) => void
  deleteTodo: (id: string) => void
  deleteMultiple: (ids: string[]) => void // Xóa nhiều todo cùng lúc
  completeMultiple: (ids: string[]) => void // Đánh dấu hoàn thành nhiều todo
  openDeleteModal: (id: string) => void
  closeDeleteModal: () => void
  confirmDelete: () => void
}

const TodoContext = createContext<TodoContextType | null>(null)

const getLocalDateStr = (d: Date = new Date()) => {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const MOCK_TODOS: Todo[] = [
  {
    id: '1',
    text: 'Học React cơ bản',
    completed: false,
    createdAt: Date.now() - 1000000,
    dueDate: 'today',
    priority: 'high',
    project: 'work',
  },
  {
    id: '2',
    text: 'Tìm hiểu về TypeScript',
    completed: true,
    createdAt: Date.now() - 500000,
    dueDate: 'today',
    priority: 'medium',
    project: 'personal',
  },
  {
    id: '3',
    text: 'Xây dựng Todo App',
    completed: false,
    createdAt: Date.now(),
    dueDate: 'tomorrow',
    priority: 'low',
    project: 'shopping',
  },
]

interface TodoProviderProps {
  children: ReactNode
}

export function TodoProvider({ children }: TodoProviderProps) {
  const [todos, setTodos] = useState<Todo[]>(MOCK_TODOS) // Khởi tạo danh sách todo với dữ liệu mẫu (MOCK_TODOS)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false) // Trạng thái đóng/mở modal xác nhận xóa
  const [todoToDelete, setTodoToDelete] = useState<Todo | null>(null) // Lưu trữ todo item đang được chọn để xóa

  // useCallback: Đảm bảo hàm addTodo không bị tạo mới trừ khi dependencies thay đổi (ở đây là rỗng nên chỉ tạo 1 lần)
  const addTodo = useCallback((text: string, date: string) => {
    const trimmed = text.trim() // Loại bỏ khoảng trắng thừa ở hai đầu
    if (trimmed.length < 3) {
      alert('Nội dung phải có ít nhất 3 ký tự')
      return
    }

    const todayStr = getLocalDateStr() // Lấy chuỗi ngày hiện tại (YYYY-MM-DD)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowStr = getLocalDateStr(tomorrow) // Lấy chuỗi ngày mai

    let dueDate = date
    // Chuẩn hóa ngày hạn: nếu là hôm nay/ngày mai thì dùng từ khóa tương ứng cho logic filter dễ dàng hơn
    if (date === todayStr) dueDate = 'today'
    else if (date === tomorrowStr) dueDate = 'tomorrow'

    const newTodo: Todo = {
      id: crypto.randomUUID(), // Tạo ID duy nhất bằng API chuẩn của browser
      text: trimmed,
      completed: false,
      createdAt: Date.now(), // Thời gian tạo (timestamp)
      dueDate,
      project: 'personal',
      priority: 'medium',
    }

    setTodos((prev) => [newTodo, ...prev]) // Thêm todo mới vào đầu danh sách
  }, [])

  // Cập nhật nội dung todo dựa trên ID
  const updateTodo = useCallback((id: string, newText: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? { ...todo, text: newText, updatedAt: Date.now() } // Cập nhật text và thời gian sửa
          : todo,
      ),
    )
  }, [])

  // Đảo ngược trạng thái hoàn thành (Check/Uncheck)
  const toggleComplete = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    )
  }, [])

  // Xóa trực tiếp todo khỏi state (không qua modal)
  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }, [])

  // Mở modal xác nhận xóa cho một todo cụ thể
  const openDeleteModal = useCallback((id: string) => {
    setTodos((prev) => {
      const todo = prev.find((t) => t.id === id)
      if (todo) {
        setTodoToDelete(todo) // Gán todo cần xóa vào state
        setIsDeleteModalOpen(true) // Mở modal
      }
      return prev
    })
  }, [])

  // Đóng modal xác nhận xóa
  const closeDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false)
  }, [])

  // Xóa nhiều todo cùng lúc theo danh sách ID (dùng cho multi-select)
  const deleteMultiple = useCallback((ids: string[]) => {
    const idSet = new Set(ids) // Chuyển mảng thành Set để kiểm tra O(1)
    setTodos((prev) => prev.filter((todo) => !idSet.has(todo.id)))
  }, [])

  // Đánh dấu hoàn thành nhiều todo cùng lúc (dùng cho multi-select)
  const completeMultiple = useCallback((ids: string[]) => {
    const idSet = new Set(ids)
    setTodos((prev) =>
      prev.map((todo) =>
        idSet.has(todo.id) ? { ...todo, completed: true } : todo,
      ),
    )
  }, [])

  // Xác nhận xóa todo sau khi người dùng nhấn "Xóa" trên modal
  const confirmDelete = useCallback(() => {
    if (todoToDelete) {
      setTodos((prev) => prev.filter((todo) => todo.id !== todoToDelete.id))
      setTodoToDelete(null) // Reset todo đang chọn
    }
  }, [todoToDelete])

  // useMemo: Chỉ tính toán lại số lượng công việc hôm nay khi danh sách todos thay đổi
  const todayCount = useMemo(() => {
    const today = getLocalDateStr()
    return todos.filter(
      (t) => !t.completed && (t.dueDate === 'today' || t.dueDate === today),
    ).length
  }, [todos])

  // Tính toán số lượng công việc ngày mai
  const tomorrowCount = useMemo(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowStr = getLocalDateStr(tomorrow)
    return todos.filter(
      (t) =>
        !t.completed && (t.dueDate === 'tomorrow' || t.dueDate === tomorrowStr),
    ).length
  }, [todos])

  // Tính toán số lượng công việc đã quá hạn (dueDate < today và chưa hoàn thành)
  const overdueCount = useMemo(() => {
    const today = getLocalDateStr()
    return todos.filter((t) => {
      if (t.completed || !t.dueDate) return false
      if (t.dueDate === 'today' || t.dueDate === 'tomorrow') return false
      return t.dueDate < today
    }).length
  }, [todos])

  // Tính toán số lượng công việc đã hoàn thành
  const completedCount = useMemo(
    () => todos.filter((t) => t.completed).length,
    [todos],
  )

  const totalCount = todos.length // Tổng số lượng công việc

  // useMemo: Gói tất cả state và actions vào một object ổn định để truyền vào Provider
  const value = useMemo<TodoContextType>(
    () => ({
      todos,
      isDeleteModalOpen,
      todoToDelete,
      todayCount,
      tomorrowCount,
      overdueCount,
      completedCount,
      totalCount,
      addTodo,
      updateTodo,
      toggleComplete,
      deleteTodo,
      deleteMultiple,
      completeMultiple,
      openDeleteModal,
      closeDeleteModal,
      confirmDelete,
    }),
    [
      todos,
      isDeleteModalOpen,
      todoToDelete,
      todayCount,
      tomorrowCount,
      overdueCount,
      completedCount,
      totalCount,
      addTodo,
      updateTodo,
      toggleComplete,
      deleteTodo,
      deleteMultiple,
      completeMultiple,
      openDeleteModal,
      closeDeleteModal,
      confirmDelete,
    ],
  )

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>
}

// Hook để truy cập toàn bộ Context (Dùng trong các component cần nhiều dữ liệu)
export function useTodo(): TodoContextType {
  const context = useContext(TodoContext)
  if (!context) {
    throw new Error('useTodo must be used within a TodoProvider')
  }
  return context
}

// Hook chuyên biệt cho các hành động (Actions) - Giúp tối ưu re-render cho các component chỉ cần gọi hàm
export function useTodoActions() {
  const {
    addTodo,
    updateTodo,
    toggleComplete,
    deleteTodo,
    deleteMultiple,
    completeMultiple,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
  } = useTodo()
  return useMemo(
    () => ({
      addTodo,
      updateTodo,
      toggleComplete,
      deleteTodo,
      deleteMultiple,
      completeMultiple,
      openDeleteModal,
      closeDeleteModal,
      confirmDelete,
    }),
    [
      addTodo,
      updateTodo,
      toggleComplete,
      deleteTodo,
      deleteMultiple,
      completeMultiple,
      openDeleteModal,
      closeDeleteModal,
      confirmDelete,
    ],
  )
}

// Hook chuyên biệt cho state (Todos)
export function useTodoState() {
  const { todos, isDeleteModalOpen, todoToDelete } = useTodo()
  return { todos, isDeleteModalOpen, todoToDelete }
}

// Hook chuyên biệt cho việc lấy các con số thống kê (Counts)
export function useTodoCounts() {
  const {
    todayCount,
    tomorrowCount,
    overdueCount,
    completedCount,
    totalCount,
  } = useTodo()
  return { todayCount, tomorrowCount, overdueCount, completedCount, totalCount }
}
