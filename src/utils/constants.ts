import type { Todo } from '@/types/todos'
// Mock dữ liệu cho data thay vì call api
export const MOCK_TODOS: Todo[] = [
  {
    id: 1,
    text: 'Học React và TypeScript',
    completed: false,
    createAt: Date.now() - 1000000,
  },
  {
    id: 2,
    text: 'Học HTML và CSS',
    completed: true,
    createAt: Date.now() - 500000,
  },
  {
    id: 3,
    text: 'Tìm hiểu về Tailwind CSS',
    completed: false,
    createAt: Date.now() - 200000,
  },
  {
    id: 4,
    text: 'Học Tanstack Query và React Hook Form',
    completed: false,
    createAt: Date.now() - 100000,
  },
  {
    id: 5,
    text: 'Học Angular và TypeScript',
    completed: true,
    createAt: Date.now() - 50000,
  },
]
export const VALIDATION_RULES = {
  MIN_LENGTH: 3,
  MAX_LENGTH: 100,
}
export const MESSAGES = {
  TODO_DELETE_SUCCESS: 'Xóa công việc thành công',
  TODO_ADD_SUCCESS: 'Thêm công việc thành công',
  TODO_UPDATE_SUCCESS: 'Cập nhật công việc thành công',
  TODO_DELETE_CONFIRM: 'Bạn có chắc chắn muốn xóa công việc này không?',

  TODO_REQUIRED: 'Vui lòng nhập công việc',
  TODO_MIN_LENGTH: `Công việc phải có ít nhất ${VALIDATION_RULES.MIN_LENGTH} ký tự`,
  TODO_MAX_LENGTH: `Công việc không được vượt quá ${VALIDATION_RULES.MAX_LENGTH} ký tự`,
  TODO_EMPTY: 'Chưa có công việc nào, hãy thêm công việc mới!',
}
