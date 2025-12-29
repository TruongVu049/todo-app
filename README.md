# MEU TODO - Ứng Dụng Quản Lý Công Việc

## 📋 Mô Tả

MEU TODO là ứng dụng quản lý công việc được xây dựng với React, TypeScript và Vite. Ứng dụng tích hợp với DummyJSON API để thực hiện các thao tác CRUD và xác thực người dùng.

## 🚀 Tính Năng

### Authentication (Xác thực)

- ✅ Đăng nhập với API thật (DummyJSON)
- ✅ Đăng xuất và xóa token
- ✅ Protected routes (bảo vệ trang)
- ✅ Lưu trạng thái đăng nhập (localStorage)

### Todo CRUD

- ✅ Xem danh sách công việc
- ✅ Thêm công việc mới
- ✅ Chỉnh sửa công việc
- ✅ Đánh dấu hoàn thành/chưa hoàn thành
- ✅ Xóa công việc (có xác nhận)

### UI/UX

- ✅ Loading state khi đang tải
- ✅ Error state khi có lỗi
- ✅ Empty state khi không có dữ liệu
- ✅ Responsive design
- ✅ Lọc và sắp xếp công việc

## 🛠️ Công Nghệ Sử Dụng

- **React 18** - UI Framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Zustand** - State management
- **React Query** - Server state & mutations
- **React Router 7** - Routing
- **React Hook Form + Zod** - Form validation
- **Radix UI** - UI components

## 📦 Cài Đặt

### Yêu cầu

- Node.js 20+
- npm hoặc yarn

### Các bước cài đặt

```bash
# Clone repository
git clone https://github.com/TruongVu049/todo-app.git

# Di chuyển vào thư mục
cd todo-app

# Cài đặt dependencies
npm install
# hoặc
yarn install

# Chạy development server
npm run dev
# hoặc
yarn dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

## 🔐 Tài Khoản Test

```
Username: emilys
Password: emilyspass
```

Hoặc các tài khoản khác từ [DummyJSON Users](https://dummyjson.com/users)

## 📁 Cấu Trúc Thư Mục

```
src/
├── api/                    # API integration
│   ├── client.ts          # Base API client
│   ├── auth.ts            # Auth endpoints
│   └── todos.ts           # Todo endpoints
├── app/                    # Application layer
│   ├── routes/            # Pages
│   │   ├── home/          # Todo list page
│   │   └── login/         # Login page
│   ├── protected-route.tsx # Route guard
│   └── router.tsx         # Router config
├── components/            # Reusable components
│   ├── layouts/           # Layout components (Outlet)
│   ├── todos/             # Todo components
│   └── ui/                # UI primitives
├── hooks/                 # Custom hooks
│   ├── use-auth.ts        # Auth hooks (useMutation)
│   └── use-disclosure.ts  # Modal state hook
├── stores/                # Zustand stores
│   ├── auth.ts            # Auth state
│   └── todos.ts           # Todo state
└── types/                 # TypeScript types
    └── api.ts             # API types
```

## 🔧 Scripts

```bash
# Development
npm run dev

# Build production
npm run build

# Preview build
npm run preview

# Type check
npm run check-types

# Lint
npm run lint
```

## 📝 API Endpoints

### Authentication

```
POST /auth/login
Body: { username, password }
Response: { id, username, email, token, ... }
```

### Todos

```
GET    /todos              # Lấy danh sách
POST   /todos/add          # Tạo mới
PUT    /todos/{id}         # Cập nhật
DELETE /todos/{id}         # Xóa
```

## ✅ Checklist Hoàn Thành

### Yêu cầu kỹ thuật

- [x] Không gọi fetch trong useEffect
- [x] Dùng useQuery và useMutation
- [x] Không dùng `any` trong TypeScript
- [x] Layout bằng Outlet
- [x] TailwindCSS cho giao diện
- [x] Cấu trúc: api/hooks/components/pages

### Chức năng

- [x] Todo CRUD hoạt động đúng
- [x] Login và logout hoạt động đúng
- [x] Protected routes hoạt động đúng
- [x] Code sạch, dễ đọc
- [x] Không có lỗi TypeScript

## 👤 Tác Giả

**Nguyễn Thế Minh Thiện**

## 📄 License

MIT License
