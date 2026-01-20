import React, { memo, useEffect, useRef, useCallback } from 'react'

interface DeleteConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  todoText: string
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = memo(
  ({ isOpen, onClose, onConfirm, todoText }) => {
    const modalRef = useRef<HTMLDivElement>(null) // Ref để quản lý focus khi modal mở

    // Tự động focus vào modal khi mở để hỗ trợ người dùng dùng phím
    useEffect(() => {
      if (isOpen) {
        const frameId = requestAnimationFrame(() => {
          modalRef.current?.focus()
        })
        return () => cancelAnimationFrame(frameId)
      }
    }, [isOpen])

    // Đóng modal khi click ra vùng bên ngoài (backdrop)
    const handleBackdropClick = useCallback(
      (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) onClose()
      },
      [onClose],
    )

    // Đóng modal khi nhấn phím Escape
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') onClose()
      },
      [onClose],
    )

    // Thực hiện hành động xóa và đóng modal
    const handleConfirmClick = useCallback(() => {
      onConfirm()
      onClose()
    }, [onConfirm, onClose])

    if (!isOpen) return null // Không render gì nếu modal không mở

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={handleBackdropClick}
        onKeyDown={handleKeyDown}
        role="none"
      >
        <div
          ref={modalRef} // Gán ref và cho phép nhận focus (tabIndex={-1})
          className="bg-white dark:bg-[#1e2736] w-full max-w-sm rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in zoom-in-95 duration-200 focus:outline-none"
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
        >
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-10 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500">
                <span className="material-symbols-outlined">delete</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Xác nhận xóa
              </h3>
            </div>

            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
              Bạn có chắc chắn muốn xóa công việc này không? Hành động này không
              thể hoàn tác.
            </p>

            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 mb-6 border border-slate-100 dark:border-slate-700/50">
              <p className="text-slate-900 dark:text-white text-sm font-medium line-clamp-2">
                &quot;{todoText}&quot;
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmClick}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold shadow-lg shadow-red-500/20 transition-colors"
              >
                Xóa ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  },
)

DeleteConfirmModal.displayName = 'DeleteConfirmModal'
