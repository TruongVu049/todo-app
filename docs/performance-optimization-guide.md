# Hướng Dẫn Chi Tiết Mã Nguồn & Tối Ưu Hiệu Năng (Todo App)

Tài liệu này cung cấp cái nhìn toàn diện về các tính năng đã thêm, vị trí file và giải thích chi tiết chức năng của từng module/hàm trong ứng dụng Todo Challenge.

---

## 1. Hệ Thống Quản Lý State & Context Pattern

### useContext & React Context API

**Khái niệm**: `useContext` là một React Hook cho phép bạn truy cập dữ liệu từ một Context mà không cần phải truyền props qua nhiều cấp trung gian (Prop Drilling).

Trong dự án này, chúng ta sử dụng một mô hình "Advanced Context Pattern" để đạt hiệu năng tối đa:

1.  **Context Splitting (Phân tách Context)**: Thay vì gộp tất cả state vào một Context duy nhất, chúng ta tách ra `TodoContext` (danh sách công việc) và `SearchContext` (từ khóa tìm kiếm). Điều này đảm bảo rằng khi người dùng gõ tìm kiếm, các component chỉ liên quan đến danh sách todo không bị ảnh hưởng.
2.  **Granular Access Hooks (Hook truy cập chi tiết)**: Chúng ta không khuyến khích sử dụng trực tiếp `useContext(TodoContext)`. Thay vào đó, dự án cung cấp 3 hook chuyên biệt:
    - `useTodoActions()`: Trả về các hàm (add, update, delete). Các hàm này có reference ổn định nhờ `useCallback`, giúp component sử dụng nó **không bị re-render** khi danh sách `todos` thay đổi.
    - `useTodoState()`: Trả về state `todos`. Chỉ những component thực sự cần hiển thị danh sách mới nên dùng hook này.
    - `useTodoCounts()`: Trả về các con số thống kê đã được `useMemo`.

### [todo-context.tsx](file:///d:/dev/test/todo-app/src/features/todo-challenge/context/todo-context.tsx)

**Chức năng**: Quản lý toàn bộ dữ liệu Todo, trạng thái xóa và các giá trị thống kê.

- **`TodoProvider`**: Component bao bọc toàn bộ ứng dụng để cung cấp state.
- **`addTodo(text, date)`**:
  - _Chỗ nào_: Dòng 81.
  - _Giải thích_: Chuẩn hóa ngày hạn (today/tomorrow), tạo ID bằng `crypto.randomUUID()`, bọc trong `useCallback` để giữ reference ổn định.
- **`updateTodo(id, text)`**:
  - _Chỗ nào_: Dòng 110.
  - _Giải thích_: Sử dụng `map()` để cập nhật nội dung và gắn thêm `updatedAt`.
- **`confirmDelete()`**:
  - _Chỗ nào_: Dòng 147.
  - _Giải thích_: Xóa todo sau khi người dùng xác nhận trên modal.
- **`useTodoCounts()`**:
  - _Giải thích_: Hook chuyên biệt sử dụng `useMemo` để tính `todayCount`, `tomorrowCount`, `overdueCount` mà không làm re-render các thành phần không liên quan.

### [search-context.tsx](file:///d:/dev/test/todo-app/src/features/todo-challenge/context/search-context.tsx)

**Chức năng**: Tách biệt state tìm kiếm để tối ưu render.

- **`SearchProvider`**: Quản lý `searchQuery`. Việc tách này giúp khi gõ tìm kiếm, các component dùng `TodoContext` (như Stats) không bị re-render.

---

## 2. Các Hook Tối Ưu (Custom Hooks)

### [use-debounce.ts](file:///d:/dev/test/todo-app/src/features/todo-challenge/hooks/use-debounce.ts)

**Chức năng**: Kiểm soát tần suất thực thi hành động.

- **`useDebouncedSearch`**:
  - _Chức năng_: Quản lý `inputValue` tức thời cho UI mượt, và gọi `onSearch` sau 300ms.
- **`useDebouncedCallback`**:
  - _Chức năng_: Bọc hàm trong `lodash.debounce` và tự động `cancel()` khi component unmount để tránh memory leak.

### [use-todo-input.ts](file:///d:/dev/test/todo-app/src/features/todo-challenge/hooks/use-todo-input.ts)

**Chức năng**: Logic xử lý cho các ô nhập liệu.

- **`validate(text)`**: Kiểm tra độ dài tối thiểu (3 ký tự).
- **`handleKeyDown(e, onEnter, onEscape)`**: Xử lý phím tắt chuyên nghiệp (Enter để lưu, Esc để hủy).

---

## 3. Thành Phần Giao Diện & Tối Ưu Render

### [todo-list.tsx](file:///d:/dev/test/todo-app/src/features/todo-challenge/components/todo-list.tsx)

**Tính năng**: Virtualization (Danh sách ảo).

- **`useVirtualizer`**:
  - _Chức năng_: Chỉ render các phần tử đang hiện diện trên màn hình.
  - _Code_: Sử dụng `getTotalSize()` tạo vùng scroll và `getVirtualItems()` để map tọa độ tuyệt đối cho từng item.

### [todo-input.tsx](file:///d:/dev/test/todo-app/src/features/todo-challenge/components/todo-input.tsx)

**Tính năng**: Unified Input (Ô nhập liệu hợp nhất).

- **`forwardRef`**: Cho phép cha gọi hàm `submit()` của con.
- **Local State**: Giữ `text` và `date` tại chỗ, chỉ gửi lên context khi đã nhấn lưu, giảm 90% số lần re-render toàn app.

### [calendar-view.tsx](file:///d:/dev/test/todo-app/src/features/todo-challenge/components/calendar-view.tsx)

**Tính năng**: Chế độ xem lịch thông minh.

- **`calendarDays`**:
  - _Chức năng_: Tính toán mảng 42 ngày (bao gồm ngày của tháng trước/sau) để lấp đầy grid 7x6.
- **`todosByDate`**:
  - _Chức năng_: Dùng `useMemo` biến đổi mảng todo thành một Map `{ [dateStr]: Todo[] }` để truy xuất cực nhanh khi render ô lịch.

---

## 4. Cơ Chế Cách Ly Re-render (Re-render Isolation)

Để trả lời câu hỏi "Làm sao để một component thay đổi không kéo theo toàn bộ trang load lại?", chúng ta đã áp dụng các chiến thuật sau:

### 1. Sử dụng React.memo cho Component con

Mọi component hiển thị chính (`GreetingHeader`, `StatsCards`, `TodoForm`, `TodoList`, `TodoItem`) đều được bọc trong `memo()`.

- **Cách hoạt động**: Khi component cha (`TodoPageContent`) render lại, React sẽ thực hiện phép so sánh nông (shallow compare) các props truyền vào component con. Nếu props không đổi, component con **không bị render lại**.
- **Kết quả**: Khi bạn chuyển `viewMode` (từ danh sách sang lịch), chỉ `GreetingHeader` và vùng hiển thị danh sách render lại, các thẻ thống kê (`StatsCards`) sẽ hoàn toàn đứng yên.

### 2. Quản lý State tại địa phương (Local State Strategy)

Đây là kỹ thuật quan trọng nhất trong `TodoInput.tsx`.

- **Vấn đề**: Nếu đưa state `text` (nội dung đang gõ) lên Context hoặc Page, mỗi lần bạn nhấn 1 phím, toàn bộ 4-5 component lớn trên trang sẽ re-render.
- **Giải pháp**: Chúng ta giữ state `text` ngay bên trong `TodoInput`.
- **Kết quả**: Toàn bộ quá trình gõ phím được xử lý nội bộ trong component nhỏ. Chỉ khi bạn nhấn Enter (Lưu), dữ liệu mới được đẩy lên Context để cập nhật ứng dụng.

### 3. Tách biệt Search Context (Context Splitting)

Bằng cách tách `searchQuery` ra một `SearchProvider` riêng:

- Khi `searchQuery` thay đổi, chỉ những component nào gọi `useSearch()` mới bị ảnh hưởng.
- Các component chỉ quan tâm đến danh sách Todo (dùng `useTodoState`) hoặc các hàm hành động (dùng `useTodoActions`) sẽ không bị kích hoạt re-render.

### 4. Hook truy cập dữ liệu tinh gọn (Granular Hooks)

- `useTodoActions()`: Trả về các hàm được bọc trong `useCallback`. Component dùng hook này (như `TodoItem`) sẽ có reference hàm ổn định, không bao giờ bị re-render vì lý do action thay đổi.

---

## 5. Tóm Tắt Kỹ Thuật Tối Ưu

| Kỹ thuật                | File áp dụng         | Mục đích                                               |
| :---------------------- | :------------------- | :----------------------------------------------------- |
| **Virtualization**      | `todo-list.tsx`      | Hiển thị danh sách hàng ngàn item mà vẫn mượt.         |
| **Context Splitting**   | `search-context.tsx` | Cô lập re-render khi gõ tìm kiếm.                      |
| **useDeferredValue**    | `todo-page.tsx`      | Giảm độ ưu tiên của việc filter list, ưu tiên gõ phím. |
| **React.lazy**          | `todo-page.tsx`      | Chỉ tải CalendarView khi người dùng chuyển tab.        |
| **useMemo/useCallback** | Toàn bộ dự án        | Giữ reference ổn định cho props và hàm xử lý.          |
| **Memo() High-Order**   | `todo-item.tsx`      | Không render lại item khi dữ liệu của nó không đổi.    |
