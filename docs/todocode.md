# 📍 Todo-Challenge - Hướng dẫn code & luồng hoạt động

> Tài liệu giải thích chi tiết code và cách ứng dụng hoạt động

---

## 🚀 LUỒNG HOẠT ĐỘNG KHI VÀO TRANG

```
┌─────────────────────────────────────────────────────────────────────┐
│                    KHI USER VÀO TRANG TODO                          │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│ 1️⃣ KHỞI TẠO STATE (todo-page.tsx dòng 46-55)                        │
│                                                                     │
│   const [todos, setTodos] = useState(MOCK_TODOS)  // Load mock data │
│   const [inputText, setInputText] = useState('')  // Input rỗng    │
│   const [navFilter, setNavFilter] = useState('all') // Hiện tất cả │
│   const [viewMode, setViewMode] = useState('list')  // Chế độ list │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│ 2️⃣ useEffect - AUTO FOCUS INPUT (dòng 57-59)                        │
│                                                                     │
│   useEffect(() => {                                                 │
│     inputRef.current?.focus()  // Focus vào ô nhập khi load xong   │
│   }, [])                                                            │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│ 3️⃣ TÍNH TOÁN useMemo (dòng 134-195)                                 │
│                                                                     │
│   todayCount     → Đếm todo hạn hôm nay                            │
│   tomorrowCount  → Đếm todo hạn ngày mai                           │
│   overdueCount   → Đếm todo quá hạn                                │
│   filteredTodos  → Lọc todos theo navFilter                        │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│ 4️⃣ RENDER GIAO DIỆN (dòng 197-291)                                  │
│                                                                     │
│   ├── DashboardLayout (sidebar + header app)                       │
│   │     ├── GreetingHeader (lời chào + view toggle)                │
│   │     ├── StatsCards (3 cards thống kê)                          │
│   │     ├── Input Form (nhập todo + date picker + nút Add)         │
│   │     └── Todo List / Board / Calendar (theo viewMode)           │
│   └── DeleteConfirmModal (ẩn, chờ trigger)                         │
└─────────────────────────────────────────────────────────────────────┘
```

---

## ➕ THÊM TODO MỚI

### Vị trí code

| Phần                | File                                                                                              | Dòng    |
| ------------------- | ------------------------------------------------------------------------------------------------- | ------- |
| **Hàm xử lý**       | [todo-page.tsx](file:///d:/dev/test/todo-app/src/features/todo-challenge/todo-page.tsx#L69-L98)   | 69-98   |
| **Input nhập text** | [todo-page.tsx](file:///d:/dev/test/todo-app/src/features/todo-challenge/todo-page.tsx#L227-L235) | 227-235 |
| **Input chọn ngày** | [todo-page.tsx](file:///d:/dev/test/todo-app/src/features/todo-challenge/todo-page.tsx#L236-L241) | 236-241 |
| **Nút Add**         | [todo-page.tsx](file:///d:/dev/test/todo-app/src/features/todo-challenge/todo-page.tsx#L243-L249) | 243-249 |

### Luồng hoạt động

```
User nhập text → Chọn ngày (optional) → Nhấn Add hoặc Enter
                              │
                              ▼
┌──────────────────────────────────────────────────────────┐
│ handleAdd() kiểm tra:                                    │
│  ├── Text >= 3 ký tự? ❌ → alert("Phải có ít nhất 3...") │
│  └── ✅ OK → Tiếp tục                                    │
└──────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────┐
│ Chuyển đổi ngày:                                         │
│  ├── inputDate === hôm nay → dueDate = 'today'          │
│  ├── inputDate === ngày mai → dueDate = 'tomorrow'      │
│  └── Ngày khác → giữ nguyên 'YYYY-MM-DD'                │
└──────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────┐
│ Tạo todo mới:                                            │
│  {                                                       │
│    id: crypto.randomUUID(),  // ID duy nhất              │
│    text: trimmed,                                        │
│    completed: false,                                     │
│    createdAt: Date.now(),                                │
│    dueDate: dueDate,                                     │
│    project: 'personal',                                  │
│    priority: 'medium'                                    │
│  }                                                       │
└──────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────┐
│ setTodos([newTodo, ...todos])  // Thêm vào đầu mảng     │
│ setInputText('')               // Xóa input             │
│ inputRef.current?.focus()      // Focus lại input       │
└──────────────────────────────────────────────────────────┘
```

### Code chi tiết

```typescript
const handleAdd = () => {
  const trimmed = inputText.trim()

  // Validate
  if (trimmed.length < 3) {
    alert('Nội dung phải có ít nhất 3 ký tự')
    return
  }

  // Chuyển đổi ngày
  const todayStr = getLocalDateStr()
  const tomorrowStr = getLocalDateStr(tomorrow)
  let dueDate = inputDate
  if (inputDate === todayStr) dueDate = 'today'
  else if (inputDate === tomorrowStr) dueDate = 'tomorrow'
-*****************
  // Tạo todo mới với UUID
  const newTodo: Todo = {
    id: crypto.randomUUID(),
    text: trimmed,
    completed: false,
    createdAt: Date.now(),
    dueDate,
    project: 'personal',
    priority: 'medium',
  }

  // Cập nhật state
  setTodos([newTodo, ...todos])
  setInputText('')
  inputRef.current?.focus()
}
```

---

## 🗑️ XÓA TODO

### Vị trí code

| Phần                  | File                                                                                                                     | Dòng    |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------ | ------- |
| **Hàm mở modal**      | [todo-page.tsx](file:///d:/dev/test/todo-app/src/features/todo-challenge/todo-page.tsx#L118-L124)                        | 118-124 |
| **Hàm xác nhận xóa**  | [todo-page.tsx](file:///d:/dev/test/todo-app/src/features/todo-challenge/todo-page.tsx#L126-L131)                        | 126-131 |
| **Nút xóa trên item** | [todo-item.tsx](file:///d:/dev/test/todo-app/src/features/todo-challenge/components/todo-item.tsx#L176-L184)             | 176-184 |
| **Modal xác nhận**    | [delete-confirm-modal.tsx](file:///d:/dev/test/todo-app/src/features/todo-challenge/components/delete-confirm-modal.tsx) | Toàn bộ |

### Luồng hoạt động

```
User click nút 🗑️ trên TodoItem
            │
            ▼
┌────────────────────────────────────────────────┐
│ TodoItem gọi: onDelete(todo.id)                │
│ → truyền ngược lên TodoPage                    │
└────────────────────────────────────────────────┘
            │
            ▼
┌────────────────────────────────────────────────┐
│ handleDeleteClick(id):                         │
│  1. Tìm todo theo id                           │
│  2. setTodoToDelete(todo)  // Lưu todo cần xóa │
│  3. setIsDeleteModalOpen(true) // Mở modal     │
└────────────────────────────────────────────────┘
            │
            ▼
┌────────────────────────────────────────────────┐
│ DeleteConfirmModal hiển thị:                   │
│  - "Bạn có chắc chắn muốn xóa?"                │
│  - Hiển thị text của todo                      │
│  - [Hủy] và [Xóa ngay]                         │
└────────────────────────────────────────────────┘
            │
    ┌───────┴───────┐
    ▼               ▼
 [Hủy]          [Xóa ngay]
    │               │
    ▼               ▼
onClose()      onConfirm() + onClose()
    │               │
    ▼               ▼
Modal đóng     handleConfirmDelete():
               setTodos(todos.filter(t => t.id !== todoToDelete.id))
               → Todo bị xóa khỏi mảng
```

### Code chi tiết

```typescript
// Bước 1: Click nút xóa → Mở modal
const handleDeleteClick = (id: string) => {
  const todo = todos.find((t) => t.id === id)
  if (todo) {
    setTodoToDelete(todo) // Lưu todo để hiển thị text trong modal
    setIsDeleteModalOpen(true) // Mở modal
  }
}

// Bước 2: Xác nhận xóa trong modal
const handleConfirmDelete = () => {
  if (todoToDelete) {
    // Dùng filter để tạo mảng mới KHÔNG chứa todo bị xóa
    setTodos(todos.filter((todo) => todo.id !== todoToDelete.id))
    setTodoToDelete(null)
  }
}
```

---

## ✏️ SỬA TODO

### Vị trí code

| Phần                 | File                                                                                                         | Dòng    |
| -------------------- | ------------------------------------------------------------------------------------------------------------ | ------- |
| **Hàm cập nhật**     | [todo-page.tsx](file:///d:/dev/test/todo-app/src/features/todo-challenge/todo-page.tsx#L100-L108)            | 100-108 |
| **Nút chỉnh sửa**    | [todo-item.tsx](file:///d:/dev/test/todo-app/src/features/todo-challenge/components/todo-item.tsx#L169-L175) | 169-175 |
| **Form edit inline** | [todo-item.tsx](file:///d:/dev/test/todo-app/src/features/todo-challenge/components/todo-item.tsx#L81-L115)  | 81-115  |
| **Hàm save/cancel**  | [todo-item.tsx](file:///d:/dev/test/todo-app/src/features/todo-challenge/components/todo-item.tsx#L33-L48)   | 33-48   |

### Luồng hoạt động

```
User click nút ✏️ Edit trên TodoItem
            │
            ▼
┌────────────────────────────────────────────────┐
│ setIsEditing(true)                             │
│ → Chuyển từ hiển thị text sang hiển thị input  │
└────────────────────────────────────────────────┘
            │
            ▼
┌────────────────────────────────────────────────┐
│ useEffect auto focus vào input                 │
│ User sửa nội dung                              │
└────────────────────────────────────────────────┘
            │
    ┌───────┴───────┐
    ▼               ▼
 Nhấn ESC      Nhấn Enter hoặc ✓
    │               │
    ▼               ▼
handleCancel   handleSave
    │               │
    ▼               ▼
setEditText    Validate >= 3 ký tự?
(oldText)           │
    │          ┌────┴────┐
    ▼          ▼         ▼
setIsEditing  ❌ alert  ✅ onUpdate(id, newText)
(false)                      │
                             ▼
                    TodoPage: handleUpdate()
                    setTodos(todos.map(...))
                    → Cập nhật text + updatedAt
```

### Code chi tiết

```typescript
// Trong TodoItem - xử lý save
const handleSave = () => {
  const trimmed = editText.trim()
  if (trimmed.length < 3) {
    alert('Nội dung phải có ít nhất 3 ký tự')
    return
  }
  onUpdate(todo.id, trimmed) // Gọi callback lên TodoPage
  setIsEditing(false)
}

// Trong TodoPage - cập nhật state
const handleUpdate = (id: string, newText: string) => {
  setTodos(
    todos.map(
      (todo) =>
        todo.id === id
          ? { ...todo, text: newText, updatedAt: Date.now() } // Spread + cập nhật
          : todo, // Giữ nguyên các todo khác
    ),
  )
}
```

---

## ✅ ĐÁNH DẤU HOÀN THÀNH

### Vị trí code

| Phần                   | File                                                                                                                 | Dòng    |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------- | ------- |
| **Hàm toggle**         | [todo-page.tsx](file:///d:/dev/test/todo-app/src/features/todo-challenge/todo-page.tsx#L110-L116)                    | 110-116 |
| **Checkbox UI**        | [todo-item.tsx](file:///d:/dev/test/todo-app/src/features/todo-challenge/components/todo-item.tsx#L59-L77)           | 59-77   |
| **Toggle từ calendar** | [calendar-view.tsx](file:///d:/dev/test/todo-app/src/features/todo-challenge/components/calendar-view.tsx#L224-L238) | 224-238 |

### Luồng hoạt động

```
User click checkbox ⭕ hoặc ✅
            │
            ▼
┌────────────────────────────────────────────────┐
│ onToggleComplete?.(todo.id)                    │
│ → Gọi callback truyền từ TodoPage              │
└────────────────────────────────────────────────┘
            │
            ▼
┌────────────────────────────────────────────────┐
│ handleToggleComplete(id):                      │
│ setTodos(todos.map(todo =>                     │
│   todo.id === id                               │
│     ? { ...todo, completed: !todo.completed }  │
│     : todo                                     │
│ ))                                             │
│                                                │
│ completed: false → true (đánh dấu xong)        │
│ completed: true → false (bỏ đánh dấu)          │
└────────────────────────────────────────────────┘
            │
            ▼
┌────────────────────────────────────────────────┐
│ UI thay đổi:                                   │
│ - Checkbox: ⭕ ↔ ✅                              │
│ - Text: bình thường ↔ gạch ngang + mờ          │
│ - Stats cards tự động cập nhật số liệu         │
└────────────────────────────────────────────────┘
```

### Code chi tiết

```typescript
const handleToggleComplete = (id: string) => {
  setTodos(
    todos.map((todo) =>
      todo.id === id
        ? { ...todo, completed: !todo.completed } // Đảo ngược giá trị
        : todo,
    ),
  )
}
```

---

## 🔍 LỌC TODO (Filter)

### Vị trí code

| Phần                   | File                                                                                              | Dòng    |
| ---------------------- | ------------------------------------------------------------------------------------------------- | ------- |
| **Logic lọc**          | [todo-page.tsx](file:///d:/dev/test/todo-app/src/features/todo-challenge/todo-page.tsx#L166-L195) | 166-195 |
| **Sidebar navigation** | Trong `DashboardLayout` (component riêng)                                                         | -       |

### Các filter

| Filter     | Điều kiện                                              |
| ---------- | ------------------------------------------------------ |
| `all`      | Hiện tất cả todos                                      |
| `today`    | `dueDate === 'today'` hoặc `dueDate === ngày_hôm_nay`  |
| `upcoming` | `dueDate === 'tomorrow'` hoặc `dueDate > ngày_hôm_nay` |
| `overdue`  | `dueDate < ngày_hôm_nay` (đã qua)                      |

### Code chi tiết

```typescript
const filteredTodos = useMemo(() => {
  const today = getLocalDateStr()
  const tomorrowStr = getLocalDateStr(tomorrow)

  if (navFilter === 'today') {
    return todos.filter((t) => t.dueDate === 'today' || t.dueDate === today)
  }

  if (navFilter === 'upcoming') {
    return todos.filter(
      (t) =>
        t.dueDate === 'tomorrow' ||
        t.dueDate === tomorrowStr ||
        (t.dueDate && t.dueDate > today),
    )
  }

  if (navFilter === 'overdue') {
    return todos.filter((t) => {
      if (!t.dueDate || t.dueDate === 'today' || t.dueDate === 'tomorrow')
        return false
      return t.dueDate < today
    })
  }

  return todos // 'all'
}, [todos, navFilter]) // Chỉ tính lại khi todos hoặc navFilter thay đổi
```

---

## 👁️ CHUYỂN CHẾ ĐỘ XEM (View Mode)

### Vị trí code

| Phần                 | File                                                                                                                    | Dòng    |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------- |
| **State viewMode**   | [todo-page.tsx](file:///d:/dev/test/todo-app/src/features/todo-challenge/todo-page.tsx#L52)                             | 52      |
| **Toggle buttons**   | [greeting-header.tsx](file:///d:/dev/test/todo-app/src/features/todo-challenge/components/greeting-header.tsx#L64-L107) | 64-107  |
| **Render theo mode** | [todo-page.tsx](file:///d:/dev/test/todo-app/src/features/todo-challenge/todo-page.tsx#L254-L281)                       | 254-281 |

### Các mode

| Mode       | Hiển thị             |
| ---------- | -------------------- |
| `list`     | Danh sách dọc, 1 cột |
| `board`    | Grid cards, 2-3 cột  |
| `calendar` | Lịch tháng           |

### Luồng hoạt động

```
User click nút [Danh sách] / [Thẻ] / [Lịch]
            │
            ▼
┌────────────────────────────────────────────────┐
│ GreetingHeader: handleViewChange(mode)         │
│ → onViewModeChange(mode)                       │
└────────────────────────────────────────────────┘
            │
            ▼
┌────────────────────────────────────────────────┐
│ TodoPage: setViewMode(mode)                    │
└────────────────────────────────────────────────┘
            │
            ▼
┌────────────────────────────────────────────────┐
│ Render theo điều kiện:                         │
│                                                │
│ {viewMode === 'calendar' ? (                   │
│   <CalendarView ... />                         │
│ ) : (                                          │
│   <div className={cn(                          │
│     'space-y-3',                               │
│     viewMode === 'board' && 'grid grid-cols-3' │
│   )}>                                          │
│     {filteredTodos.map(todo => <TodoItem />)}  │
│   </div>                                       │
│ )}                                             │
└────────────────────────────────────────────────┘
```

---

## 📝 ĐỊNH NGHĨA TYPE

**File:** [types/index.ts](file:///d:/dev/test/todo-app/src/features/todo-challenge/types/index.ts)

```typescript
export type Todo = {
  id: string // UUID duy nhất
  text: string // Nội dung công việc
  completed: boolean // true = đã hoàn thành
  createdAt: number // Timestamp milliseconds
  updatedAt?: number // Timestamp khi sửa (optional)
  dueDate?: string // 'today' | 'tomorrow' | 'YYYY-MM-DD'
  project?: string // 'work' | 'personal' | 'shopping'
  priority?: 'high' | 'medium' | 'low'
}
```

---

## 🗺️ TÓM TẮT FILES

| File                       | Vai trò                                 | Dòng code |
| -------------------------- | --------------------------------------- | --------- |
| `todo-page.tsx`            | Page chính - state, handlers, layout    | 295       |
| `types/index.ts`           | Định nghĩa Todo type                    | 11        |
| `todo-item.tsx`            | Component 1 todo (edit, delete, toggle) | 190       |
| `delete-confirm-modal.tsx` | Modal xác nhận xóa                      | 87        |
| `greeting-header.tsx`      | Header chào + view toggle               | 111       |
| `stats-cards.tsx`          | 3 cards thống kê                        | 94        |
| `calendar-view.tsx`        | Giao diện lịch tháng                    | 354       |
