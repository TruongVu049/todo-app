// Định nghĩa kiểu dữ liệu cho một công việc (Todo Item)
export type Todo = {
  id: string // Mã định danh duy nhất
  text: string // Nội dung công việc
  completed: boolean // Trạng thái đã hoàn thành hay chưa
  createdAt: number // Ngày tạo (TimeStamp)
  updatedAt?: number // Ngày cập nhật cuối (TimeStamp)
  dueDate?: string // Ngày hết hạn (định dạng YYYY-MM-DD hoặc 'today'/'tomorrow')
  project?: string // Dự án thuộc về
  priority?: 'high' | 'medium' | 'low' // Mức độ ưu tiên
}
