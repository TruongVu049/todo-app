# Luồng Hoạt Động Code Todo-Challenge

## Mục Lục

1. [Tổng Quan Kiến Trúc](#tổng-quan-kiến-trúc)
2. [Cấu Trúc Thư Mục](#cấu-trúc-thư-mục)
3. [Kiểu Dữ Liệu (Types)](#kiểu-dữ-liệu-types)
4. [Luồng Xử Lý Chính](#luồng-xử-lý-chính)
5. [Các Thuật Toán Sử Dụng](#các-thuật-toán-sử-dụng)
6. [Giải Thích Chi Tiết Từng Component](#giải-thích-chi-tiết-từng-component)

---

## Tổng Quan Kiến Trúc

Todo-Challenge là một ứng dụng quản lý công việc được xây dựng bằng **React với TypeScript**. Ứng dụng sử dụng **useState** để quản lý state cục bộ (local state) thay vì các thư viện state management phức tạp như Redux.

**Cấu trúc component:**

- **TodoPage** là component chính (parent), chứa toàn bộ logic xử lý và state
- Các component con (child) nhận dữ liệu qua props và gửi sự kiện ngược lại qua callback functions
- Dữ liệu chảy một chiều từ trên xuống (parent → children), sự kiện chảy từ dưới lên (children → parent)

---

## Cấu Trúc Thư Mục

```
src/features/todo-challenge/
├── todo-page.tsx              # Component chính - chứa logic state
├── components/
│   ├── calendar-view.tsx      # Hiển thị lịch
│   ├── delete-confirm-modal.tsx # Modal xác nhận xóa
│   ├── greeting-header.tsx    # Header với lời chào
│   ├── stats-cards.tsx        # Thẻ thống kê
│   └── todo-item.tsx          # Component todo đơn lẻ
└── types/
    └── index.ts               # Định nghĩa kiểu dữ liệu
```

---

## Kiểu Dữ Liệu (Types)

Mỗi todo được định nghĩa với các thuộc tính sau:

```typescript
export type Todo = {
  id: string // ID duy nhất, được sinh bởi crypto.randomUUID()
  text: string // Nội dung công việc
  completed: boolean // true nếu đã hoàn thành, false nếu chưa
  createdAt: number // Timestamp lúc tạo (milliseconds)
  updatedAt?: number // Timestamp lúc cập nhật (optional)
  dueDate?: string // Hạn hoàn thành: 'today', 'tomorrow', hoặc 'YYYY-MM-DD'
  project?: string // Phân loại dự án: 'work', 'personal', 'shopping'
  priority?: 'high' | 'medium' | 'low' // Mức độ ưu tiên
}
```

**Giải thích:**

- `id` sử dụng UUID để đảm bảo mỗi todo có ID duy nhất, không trùng lặp
- `dueDate` có thể là string đặc biệt ('today', 'tomorrow') hoặc ngày cụ thể theo format 'YYYY-MM-DD'
- Các field có dấu `?` là optional, có thể không có

---

## Luồng Xử Lý Chính

### 1. Khởi Tạo (Initialization)

Khi component `TodoPage` được mount (render lần đầu):

1. State `todos` được khởi tạo với mảng `MOCK_TODOS` chứa 3 todo mẫu
2. `useEffect` chạy một lần duy nhất, tự động focus vào ô input để người dùng có thể nhập ngay

```typescript
const [todos, setTodos] = useState<Todo[]>(MOCK_TODOS)

useEffect(() => {
  inputRef.current?.focus() // Focus input khi component mount
}, []) // Dependency array rỗng = chỉ chạy 1 lần
```

### 2. Thêm Todo Mới (Create)

Khi người dùng nhập nội dung và nhấn nút "Add" hoặc Enter:

**Bước 1 - Validation:** Kiểm tra nội dung có ít nhất 3 ký tự không. Nếu không, hiển thị alert lỗi và dừng lại.

**Bước 2 - Xử lý ngày:** So sánh ngày người dùng chọn với ngày hôm nay và ngày mai. Nếu trùng, chuyển thành string 'today' hoặc 'tomorrow' để dễ xử lý sau này.

**Bước 3 - Tạo todo mới:** Tạo object todo với:

- `id`: Sinh UUID mới bằng `crypto.randomUUID()`
- `createdAt`: Lấy timestamp hiện tại bằng `Date.now()`
- `completed`: Mặc định là `false`

**Bước 4 - Cập nhật state:** Thêm todo mới vào **đầu mảng** (không phải cuối) để hiển thị mới nhất lên trên.

**Bước 5 - Reset form:** Xóa text input và focus lại để sẵn sàng nhập tiếp.

```typescript
const handleAdd = () => {
  const trimmed = inputText.trim()
  if (trimmed.length < 3) {
    alert('Nội dung phải có ít nhất 3 ký tự')
    return
  }

  const newTodo: Todo = {
    id: crypto.randomUUID(),
    text: trimmed,
    completed: false,
    createdAt: Date.now(),
    dueDate,
    // ...
  }

  setTodos([newTodo, ...todos]) // Thêm vào đầu mảng
  setInputText('')
}
```

### 3. Cập Nhật Todo (Update)

Khi người dùng click nút Edit trên một todo:

1. Component `TodoItem` chuyển sang chế độ editing (`isEditing = true`)
2. Hiển thị input với nội dung hiện tại của todo
3. Khi người dùng nhấn Enter hoặc nút Save:
   - Validate nội dung mới (tối thiểu 3 ký tự)
   - Gọi callback `onUpdate(id, newText)` lên parent
4. Parent (`TodoPage`) sử dụng `Array.map()` để cập nhật todo có ID tương ứng

```typescript
const handleUpdate = (id: string, newText: string) => {
  setTodos(
    todos.map(
      (todo) =>
        todo.id === id
          ? { ...todo, text: newText, updatedAt: Date.now() }
          : todo, // Giữ nguyên các todo khác
    ),
  )
}
```

**Lý do dùng map:** React yêu cầu state phải được thay đổi một cách immutable (không sửa trực tiếp). `map()` tạo ra mảng mới với phần tử được cập nhật.

### 4. Toggle Trạng Thái Hoàn Thành

Khi người dùng click vào checkbox của todo:

1. Callback `onToggleComplete(id)` được gọi
2. Sử dụng `map()` để tìm todo và đảo ngược giá trị `completed`

```typescript
const handleToggleComplete = (id: string) => {
  setTodos(
    todos.map((todo) =>
      todo.id === id
        ? { ...todo, completed: !todo.completed } // Đảo ngược: true → false, false → true
        : todo,
    ),
  )
}
```

### 5. Xóa Todo (Delete)

Khác với các thao tác khác, xóa sử dụng **Modal xác nhận** để tránh xóa nhầm:

**Bước 1:** Khi click nút Delete, tìm todo theo ID và lưu vào state `todoToDelete`

**Bước 2:** Mở modal xác nhận (`isDeleteModalOpen = true`)

**Bước 3:** Nếu người dùng xác nhận, sử dụng `Array.filter()` để loại bỏ todo

```typescript
const handleConfirmDelete = () => {
  if (todoToDelete) {
    // filter() tạo mảng mới, chỉ giữ các todo có id KHÁC todoToDelete.id
    setTodos(todos.filter((todo) => todo.id !== todoToDelete.id))
    setTodoToDelete(null)
  }
}
```

---

## Các Thuật Toán Sử Dụng

### 1. Memoization với useMemo

`useMemo` là hook để **cache kết quả tính toán**. Giá trị chỉ được tính lại khi dependencies thay đổi, giúp tối ưu hiệu suất.

**Ví dụ đếm todos hôm nay:**

```typescript
const todayCount = useMemo(() => {
  const today = getLocalDateStr()
  return todos.filter(
    (t) => !t.completed && (t.dueDate === 'today' || t.dueDate === today),
  ).length
}, [todos]) // Chỉ tính lại khi mảng todos thay đổi
```

**Giải thích:** Thay vì tính lại mỗi lần render, `todayCount` chỉ được tính lại khi `todos` thay đổi. Điều này quan trọng vì component có thể re-render nhiều lần (ví dụ khi thay đổi filter).

### 2. Thuật Toán Đếm Quá Hạn

```typescript
const overdueCount = useMemo(() => {
  const today = getLocalDateStr() // Ví dụ: "2026-01-07"
  return todos.filter((t) => {
    // Bỏ qua nếu đã hoàn thành hoặc không có hạn
    if (t.completed || !t.dueDate) return false
    // Bỏ qua các giá trị đặc biệt
    if (t.dueDate === 'today' || t.dueDate === 'tomorrow') return false
    // So sánh string: "2026-01-05" < "2026-01-07" = true (quá hạn)
    return t.dueDate < today
  }).length
}, [todos])
```

**Trick hay:** Format 'YYYY-MM-DD' cho phép so sánh string trực tiếp vì thứ tự lexicographic (từ điển) trùng với thứ tự thời gian. Ví dụ: "2026-01-05" < "2026-01-07" là đúng.

### 3. Thuật Toán Lọc (Filtering)

```typescript
const filteredTodos = useMemo(() => {
  const today = getLocalDateStr()
  const tomorrowStr = getLocalDateStr(tomorrow)

  if (navFilter === 'today') {
    // Lọc todos có hạn hôm nay
    return todos.filter((t) => t.dueDate === 'today' || t.dueDate === today)
  }

  if (navFilter === 'upcoming') {
    // Lọc todos trong tương lai (ngày mai trở đi)
    return todos.filter(
      (t) =>
        t.dueDate === 'tomorrow' ||
        t.dueDate === tomorrowStr ||
        (t.dueDate && t.dueDate > today),
    )
  }

  if (navFilter === 'overdue') {
    // Lọc todos quá hạn
    return todos.filter((t) => {
      if (!t.dueDate || t.dueDate === 'today' || t.dueDate === 'tomorrow')
        return false
      return t.dueDate < today
    })
  }

  return todos // 'all' - trả về tất cả
}, [todos, navFilter])
```

### 4. Xử Lý Ngày Tháng Cục Bộ

```typescript
const getLocalDateStr = (d: Date = new Date()) => {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0') // Tháng bắt đầu từ 0
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}` // Format: YYYY-MM-DD
}
```

**Tại sao không dùng `toISOString()`?** Vì `toISOString()` trả về giờ UTC, có thể khác ngày local. Ví dụ: lúc 23:00 ngày 7/1 ở Việt Nam (UTC+7) sẽ là 16:00 ngày 7/1 UTC - nhưng nếu là 01:00 ngày 8/1 thì sẽ là 18:00 ngày 7/1 UTC, gây sai ngày.

---

## Giải Thích Chi Tiết Từng Component

### TodoPage (Component Chính)

**Các state quản lý:**

| State               | Kiểu           | Mục đích                                      |
| ------------------- | -------------- | --------------------------------------------- |
| `todos`             | `Todo[]`       | Mảng chứa tất cả todos                        |
| `inputText`         | `string`       | Text đang nhập trong form                     |
| `inputDate`         | `string`       | Ngày đã chọn cho todo mới                     |
| `navFilter`         | `string`       | Bộ lọc: 'all', 'today', 'upcoming', 'overdue' |
| `viewMode`          | `ViewMode`     | Chế độ xem: 'list', 'board', 'calendar'       |
| `isDeleteModalOpen` | `boolean`      | Trạng thái mở/đóng modal xóa                  |
| `todoToDelete`      | `Todo \| null` | Todo đang chờ xác nhận xóa                    |

**Luồng render:**

1. Render `GreetingHeader` với nút chuyển viewMode
2. Render `StatsCards` với số liệu thống kê (today, overdue, tomorrow count)
3. Render form nhập todo mới
4. Nếu `viewMode === 'calendar'`: render `CalendarView`
5. Ngược lại: render danh sách `TodoItem` đã được filter

### TodoItem Component

Component này có 2 chế độ: **View Mode** và **Edit Mode**.

**Props nhận vào:**

- `todo`: Object todo cần hiển thị
- `viewMode`: 'list' hoặc 'board' để thay đổi layout
- `onUpdate`: Callback khi cập nhật text
- `onDelete`: Callback khi xóa
- `onToggleComplete`: Callback khi toggle checkbox

**State nội bộ:**

- `isEditing`: Đang ở chế độ edit hay không
- `editText`: Text đang chỉnh sửa

**Luồng hoạt động:**

1. Mặc định ở View Mode: hiển thị text, checkbox, nút Edit/Delete
2. Click Edit → chuyển sang Edit Mode: hiển thị input
3. Nhấn Enter/Save → validate → gọi `onUpdate` → quay lại View Mode
4. Nhấn Escape/Cancel → reset text → quay lại View Mode

### StatsCards Component

Hiển thị 3 thẻ thống kê màu sắc:

1. **Thẻ xanh (Hôm nay)**: Số việc cần làm trong ngày
2. **Thẻ đỏ (Khẩn cấp)**: Số việc quá hạn chưa hoàn thành
3. **Thẻ cam (Ngày mai)**: Số việc cần làm ngày mai

Component nhận các count đã được tính sẵn từ parent để tránh tính toán lại.

---

## Tổng Kết Luồng Dữ Liệu

**Luồng dữ liệu một chiều (Unidirectional Data Flow):**

1. **State** (`todos`) được lưu tại `TodoPage`
2. **Computed values** (`filteredTodos`, `todayCount`, ...) được tính từ state bằng `useMemo`
3. **Props** được truyền xuống các component con (`TodoItem`, `StatsCards`)
4. **Events** (click, submit) từ component con gọi callback lên parent
5. **State update** tại parent trigger **re-render** toàn bộ

**Ưu điểm của kiến trúc này:**

- Dễ debug vì dữ liệu chỉ chảy một chiều
- Dễ test từng component độc lập
- State tập trung một nơi, dễ quản lý
