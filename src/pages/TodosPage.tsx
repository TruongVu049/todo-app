import { useTodos } from '@/hooks/useTodos'
import { TodoForm } from '@/components/todo/TodoForm'
import { TodoList } from '@/components/todo/TodoList'
import { Spinner } from '@/components/ui/spinner'
import { CircleAlert, ListTodo } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function TodosPage() {
    const { todosQuery, createMutation, updateMutation, deleteMutation } = useTodos()

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="max-w-2xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                        <ListTodo className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900">Todo List</h1>
                    <p className="text-slate-500 mt-2">Manage your tasks efficiently</p>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    {/* Form Section */}
                    <div className="p-6 border-b border-slate-100">
                        <TodoForm
                            onAdd={(input) => createMutation.mutate(input)}
                            isLoading={createMutation.isPending}
                        />
                    </div>

                    {/* Content Section */}
                    <div className="p-6">
                        {/* Loading State */}
                        {todosQuery.isLoading && (
                            <div className="flex flex-col items-center justify-center py-12">
                                <Spinner size="lg" />
                                <p className="text-slate-500 mt-4">Loading todos...</p>
                            </div>
                        )}

                        {/* Error State */}
                        {todosQuery.isError && (
                            <div className="flex flex-col items-center justify-center py-12">
                                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
                                    <CircleAlert className="w-8 h-8 text-red-500" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900">Failed to load todos</h3>
                                <p className="text-slate-500 mt-1 text-center">
                                    Something went wrong. Please try again.
                                </p>
                                <Button
                                    variant="outline"
                                    className="mt-4"
                                    onClick={() => todosQuery.refetch()}
                                >
                                    Try Again
                                </Button>
                            </div>
                        )}

                        {/* Success State */}
                        {todosQuery.isSuccess && (
                            <TodoList
                                todos={todosQuery.data.todos}
                                onToggle={(todo) =>
                                    updateMutation.mutate({
                                        id: todo.id,
                                        data: { completed: !todo.completed },
                                    })
                                }
                                onUpdate={(id, todo) =>
                                    updateMutation.mutate({ id, data: { todo } })
                                }
                                onDelete={(id) => deleteMutation.mutate(id)}
                                isUpdating={updateMutation.isPending}
                                isDeleting={deleteMutation.isPending}
                            />
                        )}
                    </div>

                    {/* Footer Stats */}
                    {todosQuery.isSuccess && todosQuery.data.todos.length > 0 && (
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
                            <div className="flex items-center justify-between text-sm text-slate-500">
                                <span>
                                    {todosQuery.data.todos.filter((t) => !t.completed).length} tasks remaining
                                </span>
                                <span>
                                    {todosQuery.data.todos.filter((t) => t.completed).length} completed
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
