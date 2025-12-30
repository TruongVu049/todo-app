import { Todo } from '@/types/todo'
import { TodoItem } from './TodoItem'
import { ClipboardList } from 'lucide-react'

type TodoListProps = {
    todos: Todo[]
    onToggle: (todo: Todo) => void
    onUpdate: (id: number, todo: string) => void
    onDelete: (id: number) => void
    isUpdating?: boolean
    isDeleting?: boolean
}

export function TodoList({
    todos,
    onToggle,
    onUpdate,
    onDelete,
    isUpdating,
    isDeleting,
}: TodoListProps) {
    // Empty State
    if (todos.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                    <ClipboardList className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">No todos yet</h3>
                <p className="text-slate-500 mt-1">Add your first task to get started</p>
            </div>
        )
    }

    return (
        <ul className="space-y-2">
            {todos.map((todo) => (
                <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={onToggle}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                    isUpdating={isUpdating}
                    isDeleting={isDeleting}
                />
            ))}
        </ul>
    )
}

export default TodoList
