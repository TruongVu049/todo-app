export type Todo = {
  id: string
  text: string
  completed: boolean
  createdAt: number
  updatedAt?: number
  dueDate?: string
  project?: string
  priority?: 'high' | 'medium' | 'low'
}
