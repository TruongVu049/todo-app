import { List } from '@/components/ui/list'
import { Todo } from '@/types/api'

import { TodoItem } from './todo-item'

type TodoListProps = {
  todos: readonly Todo[]
  isLoading: boolean
  onToggle: (id: number, completed: boolean) => void
  onEdit: (todo: Todo) => void
  onDelete: (id: number) => void
}

export const TodoList = ({
  todos,
  isLoading,
  onToggle,
  onEdit,
  onDelete,
}: TodoListProps) => {
  return (
    <List
      isLoading={isLoading}
      isEmpty={todos.length === 0}
      emptyTitle="Không có công việc nào"
      emptyDescription="Tạo công việc mới để bắt đầu."
      loadingText="Đang tải công việc..."
    >
      {todos.map((todo, index) => (
        <div key={todo.id} style={{ animationDelay: `${index * 50}ms` }}>
          <TodoItem
            todo={todo}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      ))}
    </List>
  )
}
