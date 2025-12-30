import { useState } from 'react'
import { Todo } from '@/types/todo'
import { Button } from '@/components/ui/button'
import { ConfirmationDialog } from '@/components/ui/dialog/confirmation-dialog'
import { Check, Pencil, Trash2, X } from 'lucide-react'
import { cn } from '@/utils/cn'

type TodoItemProps = {
    todo: Todo
    onToggle: (todo: Todo) => void
    onUpdate: (id: number, todo: string) => void
    onDelete: (id: number) => void
    isUpdating?: boolean
    isDeleting?: boolean
}

export function TodoItem({
    todo,
    onToggle,
    onUpdate,
    onDelete,
    isUpdating,
    isDeleting,
}: TodoItemProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [editValue, setEditValue] = useState(todo.todo)

    const handleSave = () => {
        if (editValue.trim() && editValue !== todo.todo) {
            onUpdate(todo.id, editValue.trim())
        }
        setIsEditing(false)
    }

    const handleCancel = () => {
        setEditValue(todo.todo)
        setIsEditing(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSave()
        if (e.key === 'Escape') handleCancel()
    }

    return (
        <li
            className={cn(
                'group flex items-center gap-3 p-4 rounded-xl border transition-all',
                todo.completed
                    ? 'bg-slate-50 border-slate-100'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
            )}
        >
            {/* Checkbox */}
            <button
                onClick={() => onToggle(todo)}
                disabled={isUpdating}
                className={cn(
                    'flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all',
                    todo.completed
                        ? 'bg-primary border-primary text-white'
                        : 'border-slate-300 hover:border-primary'
                )}
            >
                {todo.completed && <Check className="w-3.5 h-3.5" />}
            </button>

            {/* Content */}
            {isEditing ? (
                <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-primary bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
            ) : (
                <span
                    className={cn(
                        'flex-1 text-sm transition-all',
                        todo.completed ? 'text-slate-400 line-through' : 'text-slate-700'
                    )}
                >
                    {todo.todo}
                </span>
            )}

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {isEditing ? (
                    <>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleSave}
                            className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                            <Check className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleCancel}
                            className="h-8 w-8 text-slate-500 hover:text-slate-700"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </>
                ) : (
                    <>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsEditing(true)}
                            disabled={todo.completed}
                            className="h-8 w-8 text-slate-500 hover:text-primary hover:bg-primary/10"
                        >
                            <Pencil className="w-4 h-4" />
                        </Button>
                        <ConfirmationDialog
                            icon="danger"
                            title="Delete Todo"
                            body="Are you sure you want to delete this todo? This action cannot be undone."
                            triggerButton={
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            }
                            confirmButton={
                                <Button
                                    variant="destructive"
                                    onClick={() => onDelete(todo.id)}
                                    isLoading={isDeleting}
                                >
                                    Delete
                                </Button>
                            }
                        />
                    </>
                )}
            </div>
        </li>
    )
}

export default TodoItem
