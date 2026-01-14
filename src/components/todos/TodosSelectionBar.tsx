import React, { memo } from 'react'

import { Button } from '@/components/ui/button'

type TodosSelectionBarProps = {
  selectedCount: number
  onMarkCompleted: () => void
  onDelete: () => void
}

export const TodosSelectionBar: React.FC<TodosSelectionBarProps> = memo(
  function TodosSelectionBar({ selectedCount, onMarkCompleted, onDelete }) {
    return (
      <div className="bg-gradient-to-r from-[#00a85a]/10 to-emerald-50 border border-[#00a85a]/30 rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-6 h-6 bg-[#00a85a] text-white text-xs font-semibold rounded-full">
              {selectedCount}
            </div>
            <span className="text-sm text-gray-700 font-medium">Đã chọn</span>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={onMarkCompleted}
              className="bg-[#00a85a] hover:bg-[#00a85a]/90 text-white shadow-sm hover:shadow transition-all h-9 px-4 text-sm"
            >
              Hoàn thành
            </Button>
            <Button
              onClick={onDelete}
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 shadow-sm hover:shadow transition-all h-9 px-4 text-sm"
            >
              Xóa
            </Button>
          </div>
        </div>
      </div>
    )
  },
)
