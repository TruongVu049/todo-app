import React, { memo, useCallback } from 'react'

import { cn } from '@/utils/cn'

import { useTodoActions } from '../context'
import { useSelection } from '../context/selection-context'

// Thanh công cụ hiển thị khi có item được chọn
// Cung cấp các nút: Select All, Unselect All, Delete Selected, Mark as Completed
interface SelectionToolbarProps {
  allTodoIds: string[] // Danh sách tất cả các ID todo để hỗ trợ Select All
  className?: string
}

export const SelectionToolbar: React.FC<SelectionToolbarProps> = memo(
  ({ allTodoIds, className }) => {
    const { selectedIds, selectedCount, selectAll, unselectAll } =
      useSelection()
    const { deleteMultiple, completeMultiple } = useTodoActions()

    // Xử lý nút Select All
    const handleSelectAll = useCallback(() => {
      selectAll(allTodoIds)
    }, [selectAll, allTodoIds])

    // Xử lý nút Unselect All
    const handleUnselectAll = useCallback(() => {
      unselectAll()
    }, [unselectAll])

    // Xử lý nút Delete Selected
    const handleDeleteSelected = useCallback(() => {
      // Capture IDs ngay lập tức trước khi hiển thị confirm
      const idsToDelete = [...selectedIds]
      if (idsToDelete.length === 0) return

      // Xác nhận trước khi xóa
      const confirmed = window.confirm(
        `Bạn có chắc muốn xóa ${idsToDelete.length} công việc?`,
      )

      if (confirmed) {
        // Bỏ chọn trước để UI cập nhật ngay
        unselectAll()
        // Sau đó mới xóa
        deleteMultiple(idsToDelete)
      }
    }, [selectedIds, deleteMultiple, unselectAll])

    // Xử lý nút Mark as Completed
    const handleCompleteSelected = useCallback(() => {
      const idsToComplete = Array.from(selectedIds)
      if (idsToComplete.length === 0) return

      completeMultiple(idsToComplete)
      unselectAll() // Bỏ chọn sau khi hoàn thành
    }, [selectedIds, completeMultiple, unselectAll])

    // Không hiển thị toolbar nếu không có item nào được chọn
    if (selectedCount === 0) {
      return null
    }

    return (
      <div
        className={cn(
          // Fixed ở dưới cùng màn hình, không ảnh hưởng đến layout
          'fixed bottom-4 left-1/2 -translate-x-1/2 z-50',
          'flex items-center justify-between gap-4 px-4 py-3',
          'bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700',
          'animate-in slide-in-from-bottom-4 fade-in duration-300',
          className,
        )}
      >
        {/* Số lượng đã chọn */}
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">
            check_box
          </span>
          <span className="text-sm font-medium text-primary">
            Đã chọn {selectedCount} công việc
          </span>
        </div>

        {/* Các nút hành động */}
        <div className="flex items-center gap-2">
          {/* Nút Select All */}
          <button
            type="button"
            onClick={handleSelectAll}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Chọn tất cả
          </button>

          {/* Nút Unselect All */}
          <button
            type="button"
            onClick={handleUnselectAll}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Bỏ chọn
          </button>

          {/* Divider */}
          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />

          {/* Nút Mark as Completed */}
          <button
            type="button"
            onClick={handleCompleteSelected}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">
              check_circle
            </span>
            Hoàn thành
          </button>

          {/* Nút Delete Selected */}
          <button
            type="button"
            onClick={handleDeleteSelected}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">
              delete
            </span>
            Xóa
          </button>
        </div>
      </div>
    )
  },
)

SelectionToolbar.displayName = 'SelectionToolbar'
