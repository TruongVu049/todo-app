import * as React from 'react'

import { cn } from '@/utils/cn'

interface UndoToastProps {
  show: boolean
  message: string
  onUndo: () => void
  onDismiss: () => void
}

export function UndoToast({
  show,
  message,
  onUndo,
  onDismiss,
}: UndoToastProps) {
  if (!show) return null

  const handleUndo = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    onUndo()
  }

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    onDismiss()
  }

  return (
    <div
      role="alert"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-300"
    >
      <div className="flex items-center gap-4 bg-slate-900 dark:bg-slate-800 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700">
        <span className="material-symbols-outlined text-[20px] text-slate-400">
          info
        </span>
        <span className="text-sm font-medium">{message}</span>
        <button
          onClick={handleUndo}
          className="px-3 py-1 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-lg flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[16px]">undo</span>
          Hoàn tác
        </button>
        <button
          onClick={handleDismiss}
          className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>
    </div>
  )
}

// Simple toast for general messages
interface ToastProps {
  show: boolean
  message: string
  type?: 'success' | 'error' | 'info'
  onDismiss: () => void
}

export function Toast({ show, message, type = 'info', onDismiss }: ToastProps) {
  React.useEffect(() => {
    if (show) {
      const timer = setTimeout(onDismiss, 3000)
      return () => clearTimeout(timer)
    }
  }, [show, onDismiss])

  if (!show) return null

  const iconMap = {
    success: { icon: 'check_circle', color: 'text-emerald-400' },
    error: { icon: 'error', color: 'text-red-400' },
    info: { icon: 'info', color: 'text-blue-400' },
  }

  const { icon, color } = iconMap[type]

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="flex items-center gap-3 bg-slate-900 dark:bg-slate-800 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700">
        <span className={cn('material-symbols-outlined text-[20px]', color)}>
          {icon}
        </span>
        <span className="text-sm font-medium">{message}</span>
        <button
          onClick={onDismiss}
          className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>
    </div>
  )
}
