export const APP_CONFIG = {
  DEFAULT_TODOS_LIMIT: 30,
  DEFAULT_USER_ID: 1,
} as const

export const DEMO_ACCOUNT = {
  username: 'addisonw',
  password: 'addisonwpass',
} as const

// todos
export const MESSAGES = {
  errors: {
    loadTodosFailed: 'Không thể tải danh sách việc cần làm',
    createTodoFailed: 'Không thể tạo công việc',
    updateTodoFailed: 'Không thể cập nhật công việc',
    deleteTodoFailed: 'Không thể xóa công việc',
    loginFailed: 'Đăng nhập thất bại. Vui lòng thử lại.',
    genericError: 'Đã xảy ra lỗi. Vui lòng thử lại.',
  },
  success: {
    todoCreated: 'Tạo công việc thành công',
    todoUpdated: 'Cập nhật công việc thành công',
    todoDeleted: 'Xóa công việc thành công',
  },
  confirmations: {
    deleteTodo: {
      title: 'Xóa công việc',
      description:
        'Bạn có chắc chắn muốn xóa công việc này không? Hành động này không thể hoàn tác.',
      confirmText: 'Xóa',
    },
    logout: {
      title: 'Đăng xuất',
      description:
        'Bạn có chắc chắn muốn đăng xuất không? Bạn cần đăng nhập lại để truy cập danh sách việc cần làm của mình.',
      confirmText: 'Đăng xuất',
    },
  },
} as const
