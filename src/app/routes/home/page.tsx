'use client'

import { useEffect, useState } from 'react'
import { useTodoStore } from '@/stores/todos'
import { Head } from '@/components/seo'
import { AddTodoDialog, TodoItem } from '@/components/todos'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCw } from 'lucide-react'

type FilterType = 'all' | 'today' | 'custom' | 'range' | 'asc' | 'desc' | 'completed' | 'incomplete'

const Home = () => {
  const todos = useTodoStore((state) => state.todos)
  const loading = useTodoStore((state) => state.loading)
  const error = useTodoStore((state) => state.error)
  const fetchTodos = useTodoStore((state) => state.fetchTodos)
  const clearError = useTodoStore((state) => state.clearError)
  
  const [filterType, setFilterType] = useState<FilterType>('all')
  const [customDate, setCustomDate] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    fetchTodos()
  }, [fetchTodos])
  
  // Filter and sort todos
  const filteredTodos = todos
    .filter((todo) => {
      if (filterType === 'completed') return todo.completed
      if (filterType === 'incomplete') return !todo.completed
      if (filterType === 'all' || filterType === 'asc' || filterType === 'desc') return true
      if (!todo.createdAt) return false
      
      const todoDate = new Date(todo.createdAt)
      const now = new Date()
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const todoDateStart = new Date(todoDate.getFullYear(), todoDate.getMonth(), todoDate.getDate())
      
      switch (filterType) {
        case 'today':
          return todayStart.getTime() === todoDateStart.getTime()
        case 'custom':
          if (!customDate) return true
          const selectedDate = new Date(customDate)
          const selectedDateStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())
          return todoDateStart.getTime() === selectedDateStart.getTime()
        case 'range':
          if (!startDate || !endDate) return true
          const start = new Date(startDate)
          const end = new Date(endDate)
          const startDateStart = new Date(start.getFullYear(), start.getMonth(), start.getDate())
          const endDateStart = new Date(end.getFullYear(), end.getMonth(), end.getDate())
          return todoDateStart >= startDateStart && todoDateStart <= endDateStart
        default:
          return true
      }
    })
    .sort((a, b) => {
      if (filterType === 'asc') return a.todo.localeCompare(b.todo, 'vi')
      if (filterType === 'desc') return b.todo.localeCompare(a.todo, 'vi')
      return 0
    })

  const handleRefresh = () => {
    fetchTodos()
  }

  const handleFilterChange = (value: string) => {
    setFilterType(value as FilterType)
    if (value !== 'custom') setCustomDate('')
    if (value !== 'range') {
      setStartDate('')
      setEndDate('')
    }
  }

  return (
    <>
      <Head description="Quản lý công việc của bạn" />
      
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Page Title */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Công Việc Của Tôi</h1>
            <p className="text-gray-600 mt-1">Quản lý và theo dõi các công việc hàng ngày</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start justify-between">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">Lỗi</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
              <button
                onClick={clearError}
                className="text-red-600 hover:text-red-700 text-xl font-semibold"
              >
                ×
              </button>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-4 items-center">
            <AddTodoDialog onSuccess={handleRefresh} />
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={loading}
              className="h-10 px-4"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Đang tải...' : 'Làm Mới'}
            </Button>
            
            {/* Filter Controls */}
            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={filterType}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="h-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-700 font-medium cursor-pointer hover:border-gray-400 transition-colors"
              >
                <option value="all">Tất cả</option>
                <option value="completed">Đã hoàn thành</option>
                <option value="incomplete">Chưa hoàn thành</option>
                <option value="today">Hôm nay</option>
                <option value="asc">Từ A-Z</option>
                <option value="desc">Từ Z-A</option>
                <option value="custom">Chọn ngày</option>
                <option value="range">Khoảng thời gian</option>
              </select>
              
              {filterType === 'custom' && (
                <input
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className="h-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-700 font-medium cursor-pointer hover:border-gray-400 transition-colors"
                />
              )}
              
              {filterType === 'range' && (
                <>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value)
                      if (e.target.value && endDate) {
                        const start = new Date(e.target.value)
                        const end = new Date(endDate)
                        const diffDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
                        if (diffDays > 30) {
                          const maxEnd = new Date(start)
                          maxEnd.setDate(maxEnd.getDate() + 30)
                          setEndDate(maxEnd.toISOString().split('T')[0])
                        }
                      }
                    }}
                    className="h-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-700 font-medium cursor-pointer hover:border-gray-400 transition-colors"
                  />
                  <span className="text-gray-500">→</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => {
                      if (startDate) {
                        const start = new Date(startDate)
                        const end = new Date(e.target.value)
                        const diffDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
                        if (diffDays > 30) {
                          alert('Khoảng thời gian tối đa là 30 ngày!')
                          return
                        }
                      }
                      setEndDate(e.target.value)
                    }}
                    min={startDate}
                    className="h-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-700 font-medium cursor-pointer hover:border-gray-400 transition-colors"
                  />
                </>
              )}
            </div>
          </div>

          {/* Loading State */}
          {loading && todos.length === 0 && (
            <div className="bg-white rounded-lg shadow p-8">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="ml-3 text-gray-600">Đang tải công việc...</p>
              </div>
            </div>
          )}

          {/* Main Grid: Stats + Todos */}
          {!loading && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Stats - Left Side */}
              {filteredTodos.length > 0 && (
                <div className="lg:col-span-1 space-y-4">
                  <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-gray-600 text-sm font-medium">Tổng Công Việc</p>
                    <p className="text-4xl font-bold text-gray-900 mt-2">
                      {filteredTodos.length}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-gray-600 text-sm font-medium">Đã Hoàn Thành</p>
                    <p className="text-4xl font-bold text-green-600 mt-2">
                      {filteredTodos.filter((t) => t.completed).length}
                    </p>
                  </div>
                </div>
              )}

              {/* Todos List - Right Side */}
              <div className={filteredTodos.length > 0 ? "lg:col-span-3" : "lg:col-span-4"}>
                <div className="bg-white rounded-lg shadow">
                  {filteredTodos.length === 0 ? (
                    <div className="p-8 text-center">
                      <p className="text-gray-500 text-lg">
                        {filterType === 'all' || filterType === 'asc' || filterType === 'desc'
                          ? 'Chưa có công việc nào. Tạo một công việc để bắt đầu!'
                          : filterType === 'completed'
                          ? 'Chưa có công việc nào được hoàn thành'
                          : filterType === 'incomplete'
                          ? 'Tất cả công việc đã hoàn thành!'
                          : filterType === 'custom' && customDate
                          ? `Không có công việc nào vào ngày ${new Date(customDate).toLocaleDateString('vi-VN')}`
                          : filterType === 'range' && startDate && endDate
                          ? `Không có công việc nào từ ${new Date(startDate).toLocaleDateString('vi-VN')} đến ${new Date(endDate).toLocaleDateString('vi-VN')}`
                          : `Không có công việc nào ${filterType === 'today' ? 'hôm nay' : 'trong khoảng thời gian này'}`
                        }
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200 max-h-[calc(100vh-350px)] overflow-y-auto">
                      {filteredTodos.map((todo, index) => (
                        <div key={`todo-${todo.id}-${index}`} className="p-4">
                          <TodoItem todo={todo} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Home
