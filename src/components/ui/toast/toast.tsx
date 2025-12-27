import * as React from 'react'

type ToastVariant = 'default' | 'destructive' | 'success'

type Toast = {
  id: string
  title?: string
  description?: string
  variant?: ToastVariant
}

type ToastContextValue = {
  addToast: (
    t: Omit<Toast, 'id'> & { id?: string; duration?: number },
  ) => string
  removeToast: (id: string) => void
}

const ToastContext = React.createContext<ToastContextValue | undefined>(
  undefined,
)

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = React.useCallback(
    (t: Omit<Toast, 'id'> & { id?: string; duration?: number }) => {
      const id = t.id ?? String(Date.now() + Math.random())
      setToasts((prev) => [
        {
          id,
          title: t.title,
          description: t.description,
          variant: t.variant ?? 'default',
        },
        ...prev,
      ])
      if ((t.duration ?? 4000) > 0) {
        setTimeout(() => removeToast(id), t.duration ?? 4000)
      }
      return id
    },
    [removeToast],
  )

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed right-4 bottom-4 z-50 flex flex-col gap-2 max-w-xs">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`w-full rounded-md px-3 py-2 shadow-md text-sm text-white ${
              toast.variant === 'destructive'
                ? 'bg-red-600'
                : toast.variant === 'success'
                  ? 'bg-green-600'
                  : 'bg-gray-800'
            }`}
            role="status"
            aria-live="polite"
          >
            {toast.title && <div className="font-medium">{toast.title}</div>}
            {toast.description && (
              <div className="text-xs opacity-90">{toast.description}</div>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToastContext = () => {
  const ctx = React.useContext(ToastContext)
  if (!ctx) throw new Error('useToastContext must be used within ToastProvider')
  return ctx
}
