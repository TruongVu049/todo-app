import { useState } from 'react'
import { CreateTodoInput } from '@/types/todo'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

type TodoFormProps = {
    onAdd: (input: CreateTodoInput) => void
    isLoading?: boolean
}

export function TodoForm({ onAdd, isLoading }: TodoFormProps) {
    const [todo, setTodo] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!todo.trim()) return

        onAdd({
            todo: todo.trim(),
            completed: false,
            userId: 1,
        })
        setTodo('')
    }

    return (
        <form onSubmit={handleSubmit} className="flex gap-3">
            <input
                type="text"
                value={todo}
                onChange={(e) => setTodo(e.target.value)}
                placeholder="What needs to be done?"
                className="flex-1 h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                disabled={isLoading}
            />
            <Button
                type="submit"
                disabled={!todo.trim() || isLoading}
                isLoading={isLoading}
                className="h-11 px-5 rounded-xl"
                icon={<Plus className="w-4 h-4" />}
            >
                Add
            </Button>
        </form>
    )
}

export default TodoForm
