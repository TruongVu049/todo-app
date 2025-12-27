import * as React from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/utils/cn'

export interface FilterOptions {
  status: 'all' | 'pending' | 'completed'
  priority: 'all' | 'high' | 'medium' | 'low'
  dateRange: 'all' | 'today' | 'tomorrow'
}

interface FilterModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  filters?: FilterOptions
  onApplyFilters?: (filters: FilterOptions) => void
}

export function FilterModal({
  open,
  onOpenChange,
  filters: initialFilters,
  onApplyFilters,
}: FilterModalProps) {
  const [filters, setFilters] = React.useState<FilterOptions>(
    initialFilters || {
      status: 'all',
      priority: 'all',
      dateRange: 'all',
    },
  )

  // Update local state when initialFilters change
  React.useEffect(() => {
    if (initialFilters) {
      setFilters(initialFilters)
    }
  }, [initialFilters])

  const handleApply = () => {
    onApplyFilters?.(filters)
    onOpenChange(false)
  }

  const handleReset = () => {
    const resetFilters: FilterOptions = {
      status: 'all',
      priority: 'all',
      dateRange: 'all',
    }
    setFilters(resetFilters)
    onApplyFilters?.(resetFilters)
  }

  const hasActiveFilters =
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.dateRange !== 'all'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <span className="material-symbols-outlined text-primary">
              filter_list
            </span>
            Bộ lọc & Nhãn
            {hasActiveFilters && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                Đang lọc
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Status Filter */}
          <div className="space-y-2">
            <span className="text-sm font-medium text-slate-900 dark:text-white">
              Trạng thái
            </span>
            <div className="flex gap-2">
              {[
                { value: 'all', label: 'Tất cả', icon: 'list' },
                { value: 'pending', label: 'Đang làm', icon: 'schedule' },
                {
                  value: 'completed',
                  label: 'Hoàn thành',
                  icon: 'check_circle',
                },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() =>
                    setFilters({
                      ...filters,
                      status: option.value as FilterOptions['status'],
                    })
                  }
                  className={cn(
                    'flex-1 flex flex-col items-center gap-1 p-3 rounded-lg border transition-all',
                    filters.status === option.value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-slate-200 dark:border-slate-700 hover:border-primary/50',
                  )}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {option.icon}
                  </span>
                  <span className="text-xs font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Priority Filter */}
          <div className="space-y-2">
            <span className="text-sm font-medium text-slate-900 dark:text-white">
              Độ ưu tiên
            </span>
            <div className="flex gap-2">
              {[
                { value: 'all', label: 'Tất cả', color: 'bg-slate-500' },
                { value: 'high', label: 'Cao', color: 'bg-red-500' },
                {
                  value: 'medium',
                  label: 'Trung bình',
                  color: 'bg-yellow-500',
                },
                { value: 'low', label: 'Thấp', color: 'bg-green-500' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() =>
                    setFilters({
                      ...filters,
                      priority: option.value as FilterOptions['priority'],
                    })
                  }
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 p-2.5 rounded-lg border transition-all',
                    filters.priority === option.value
                      ? 'border-primary bg-primary/10'
                      : 'border-slate-200 dark:border-slate-700 hover:border-primary/50',
                  )}
                >
                  <span
                    className={cn('w-2 h-2 rounded-full', option.color)}
                  ></span>
                  <span className="text-xs font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="space-y-2">
            <span className="text-sm font-medium text-slate-900 dark:text-white">
              Thời gian
            </span>
            <div className="flex gap-2">
              {[
                { value: 'all', label: 'Tất cả', icon: 'date_range' },
                { value: 'today', label: 'Hôm nay', icon: 'today' },
                { value: 'tomorrow', label: 'Ngày mai', icon: 'event' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() =>
                    setFilters({
                      ...filters,
                      dateRange: option.value as FilterOptions['dateRange'],
                    })
                  }
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border transition-all',
                    filters.dateRange === option.value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-slate-200 dark:border-slate-700 hover:border-primary/50',
                  )}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {option.icon}
                  </span>
                  <span className="text-sm font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={!hasActiveFilters}
          >
            Đặt lại
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button onClick={handleApply}>Áp dụng</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
