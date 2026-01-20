import { useCallback, memo } from 'react';
import { FilterTab } from '@/types/todo';
import { TodoForm, TodoList, TodoProvider, useTodoContext } from '@/components/todo-challenge';
import { Head } from '@/components/seo';
import { Button } from '@/components/ui/button';

// Component con sử dụng Context
const TodoContent = memo(function TodoContent() {
  const {
    filteredTodos,
    activeTab,
    stats,
    setActiveTab,
    addTodo,
    editTodo,
    deleteTodo,
    toggleSelect,
    toggleComplete,
    selectAll,
    unselectAll,
    deleteSelected,
    completeSelected,
  } = useTodoContext();

  // useCallback: Xử lý xóa nhiều
  const handleDeleteSelected = useCallback(() => {
    if (stats.selected === 0) return;
    if (window.confirm(`Xóa ${stats.selected} todo đã chọn?`)) {
      deleteSelected();
    }
  }, [stats.selected, deleteSelected]);

  // useCallback: Xử lý hoàn thành nhiều
  const handleCompleteSelected = useCallback(() => {
    if (stats.selected === 0) return;
    completeSelected();
  }, [stats.selected, completeSelected]);

  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'all', label: 'Tất cả' },
    { key: 'active', label: 'Đang làm' },
    { key: 'completed', label: 'Hoàn thành' },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Todo Challenge</h1>

      {/* Add Form */}
      <TodoForm onSubmit={addTodo} />

      {/* Stats */}
      <div className="flex gap-3 mb-4">
        <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-center min-w-[80px]">
          <p className="text-xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-500">Tổng</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2 text-center min-w-[80px]">
          <p className="text-xl font-bold text-green-600">{stats.completed}</p>
          <p className="text-xs text-green-600">Hoàn thành</p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-2 text-center min-w-[80px]">
          <p className="text-xl font-bold text-orange-600">{stats.active}</p>
          <p className="text-xs text-orange-600">Đang làm</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === tab.key
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bulk Actions */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Button variant="outline" size="sm" onClick={selectAll}>
          Chọn tất cả
        </Button>
        <Button variant="outline" size="sm" onClick={unselectAll}>
          Bỏ chọn
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCompleteSelected}
          disabled={stats.selected === 0}
          className="text-green-600 hover:text-green-700 hover:bg-green-50 disabled:opacity-50"
        >
          Hoàn thành ({stats.selected})
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDeleteSelected}
          disabled={stats.selected === 0}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 disabled:opacity-50"
        >
          Xóa ({stats.selected})
        </Button>
      </div>

      {/* Todo List */}
      <TodoList
        todos={filteredTodos}
        onEdit={editTodo}
        onDelete={deleteTodo}
        onToggleSelect={toggleSelect}
        onToggleComplete={toggleComplete}
      />
    </div>
  );
});

// Page component với Provider
const TodoChallengePage = () => {
  return (
    <>
      <Head description="Todo Challenge - Quản lý công việc" />
      <TodoProvider>
        <TodoContent />
      </TodoProvider>
    </>
  );
};

export default TodoChallengePage;
