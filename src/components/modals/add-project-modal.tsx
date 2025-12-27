import * as React from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/utils/cn'

interface AddProjectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onProjectAdd?: (project: { name: string; color: string }) => void
}

const COLORS = [
  { name: 'blue', value: 'bg-blue-500', label: 'Xanh dương' },
  { name: 'emerald', value: 'bg-emerald-500', label: 'Xanh lá' },
  { name: 'purple', value: 'bg-purple-500', label: 'Tím' },
  { name: 'red', value: 'bg-red-500', label: 'Đỏ' },
  { name: 'orange', value: 'bg-orange-500', label: 'Cam' },
  { name: 'pink', value: 'bg-pink-500', label: 'Hồng' },
  { name: 'yellow', value: 'bg-yellow-500', label: 'Vàng' },
  { name: 'cyan', value: 'bg-cyan-500', label: 'Xanh ngọc' },
]

export function AddProjectModal({
  open,
  onOpenChange,
  onProjectAdd,
}: AddProjectModalProps) {
  const [name, setName] = React.useState('')
  const [selectedColor, setSelectedColor] = React.useState('blue')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    onProjectAdd?.({
      name: name.trim(),
      color: selectedColor,
    })

    setName('')
    setSelectedColor('blue')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <span className="material-symbols-outlined text-primary">
              create_new_folder
            </span>
            Tạo dự án mới
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Project Name */}
          <div className="space-y-2">
            <label
              htmlFor="project-name"
              className="text-sm font-medium text-slate-900 dark:text-white"
            >
              Tên dự án
            </label>
            <input
              id="project-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên dự án..."
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
            />
          </div>

          {/* Color Selection */}
          <div className="space-y-2">
            <span className="text-sm font-medium text-slate-900 dark:text-white">
              Màu sắc
            </span>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setSelectedColor(color.name)}
                  className={cn(
                    'size-8 rounded-full transition-all flex items-center justify-center',
                    color.value,
                    selectedColor === color.name
                      ? 'ring-2 ring-offset-2 ring-slate-400'
                      : 'hover:scale-110',
                  )}
                  title={color.label}
                >
                  {selectedColor === color.name && (
                    <span className="material-symbols-outlined text-white text-[16px]">
                      check
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
            <p className="text-xs text-slate-500 mb-2">Xem trước:</p>
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  'w-2.5 h-2.5 rounded-full',
                  COLORS.find((c) => c.name === selectedColor)?.value,
                )}
              ></span>
              <span className="text-sm font-medium text-slate-900 dark:text-white">
                {name || 'Tên dự án'}
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              Tạo dự án
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
