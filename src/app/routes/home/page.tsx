'use client'

import { useEffect, useState, useMemo } from 'react'
import { useTodoStore } from '@/stores/todos'
import { Head } from '@/components/seo'
import { AddTodoDialog, TodoItem } from '@/components/todos'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCw, Trash2, CheckCircle, ListTodo, CheckCheck, Clock } from 'lucide-react'

type FilterTab = 'all' | 'active' | 'completed'

const Home = () => {
  const todos = useTodoStore((state) => state.todos)
  const loading = useTodoStore((state) => state.loading)
  const error = useTodoStore((state) => state.error)
  const fetchTodos = useTodoStore((state) => state.fetchTodos)
  const clearError = useTodoStore((state) => state.clearError)
  const selectAll = useTodoStore((state) => state.selectAll)
  const unselectAll = useTodoStore((state) => state.unselectAll)
  const deleteSelected = useTodoStore((state) => state.deleteSelected)
  const completeSelected = useTodoStore((state) => state.completeSelected)
  
  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const [isDeleting, setIsDeleting] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)

  useEffect(() => {
    fetchTodos()
  }, [fetchTodos])

  const stats = useMemo(() => {
    const total = todos.length
    const completed = todos.filter((t) => t.completed).length
    const active = total - completed
    const selected = todos.filter((t) => t.selected).length
    return { total, completed, active, selected }
  }, [todos])

  const filteredTodos = useMemo(() => {
    switch (activeTab) {
      case 'completed': return todos.filter((t) => t.completed)
      case 'active': return todos.filter((t) => !t.completed)
      default: return todos
    }
  }, [todos, activeTab])

  const handleRefresh = () => fetchTodos()

  const handleDeleteSelected = async () => {
    if (stats.selected === 0) return
    if (!window.confirm(`Xóa ${stats.selected} công việc đã chọn?`)) return
    setIsDeleting(true)
    try { await deleteSelected() } catch (e) { console.error(e) } finally { setIsDeleting(false) }
  }

  const handleCompleteSelected = async () => {
    if (stats.selected === 0) return
    setIsCompleting(true)
    try { await completeSelected() } catch (e) { console.error(e) } finally { setIsCompleting(false) }
  }

  const tabs: { key: FilterTab; label: string; count: number; icon: React.ReactNode }[] = [
    { key: 'all', label: 'Tất cả', count: stats.total, icon: <ListTodo className="w-4 h-4" /> },
    { key: 'active', label: 'Đang làm', count: stats.active, icon: <Clock className="w-4 h-4" /> },
    { key: 'completed', label: 'Hoàn thành', count: stats.completed, icon: <CheckCheck className="w-4 h-4" /> },
  ]

  return (
    <>
      <Head description="Quản lý công việc của bạn" />
      <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Công Việc Của Tôi</h1>
          <p className="text-gray-500 text-sm mt-1">Quản lý và theo dõi các công việc hàng ngày</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
            <button onClick={clearError} className="text-red-600 hover:text-red-700 font-bold">×</button>
          </div>
        )}

        {/* 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Stats & Actions */}
          <div className="lg:col-span-1 space-y-4">
            {/* Stats Cards */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Thống kê</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Tổng công việc</span>
                  <span className="text-xl font-bold text-gray-900">{stats.total}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-green-600">Đã hoàn thành</span>
                  <span className="text-xl font-bold text-green-600">{stats.completed}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <span className="text-orange-600">Còn lại</span>
                  <span className="text-xl font-bold text-orange-600">{stats.active}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Thao tác</h3>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <AddTodoDialog onSuccess={handleRefresh} />
                  <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={selectAll} className="flex-1">
                    Chọn tất cả
                  </Button>
                  <Button variant="outline" size="sm" onClick={unselectAll} className="flex-1">
                    Bỏ chọn
                  </Button>
                </div>
                <Button
                  variant="outline" size="sm"
                  onClick={handleCompleteSelected}
                  disabled={stats.selected === 0 || isCompleting}
                  className="w-full text-green-600 border-green-300 hover:bg-green-50 hover:text-green-700 disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Hoàn thành ({stats.selected})
                </Button>
                <Button
                  variant="outline" size="sm"
                  onClick={handleDeleteSelected}
                  disabled={stats.selected === 0 || isDeleting}
                  className="w-full text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Xóa ({stats.selected})
                </Button>
              </div>
            </div>
          </div>

          {/* Right - Todo List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Tabs */}
              <div className="border-b border-gray-200">
                <div className="flex">
                  {tabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === tab.key
                          ? 'border-blue-500 text-blue-600 bg-blue-50'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {tab.icon}
                      <span className="hidden sm:inline">{tab.label}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        activeTab === tab.key ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                      }`}>{tab.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Loading */}
              {loading && todos.length === 0 && (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-3 text-gray-500 text-sm">Đang tải công việc...</p>
                </div>
              )}

              {/* Todo List */}
              {!loading && (
                filteredTodos.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ListTodo className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500">
                      {activeTab === 'all' ? 'Chưa có công việc nào' : activeTab === 'completed' ? 'Chưa có công việc hoàn thành' : 'Tất cả đã hoàn thành! 🎉'}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
                    {filteredTodos.map((todo) => (
                      <div key={todo.id} className="px-4 py-3 hover:bg-gray-50 transition-colors">
                        <TodoItem todo={todo} />
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
