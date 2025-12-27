import { useToastContext } from './toast'

export const useToast = () => {
  const { addToast, removeToast } = useToastContext()

  return {
    toast: (opts: {
      title?: string
      description?: string
      variant?: 'default' | 'destructive' | 'success'
      duration?: number
    }) =>
      addToast({
        title: opts.title,
        description: opts.description,
        variant: opts.variant,
        duration: opts.duration,
      }),
    remove: (id: string) => removeToast(id),
    success: (opts: {
      title?: string
      description?: string
      duration?: number
    }) =>
      addToast({
        title: opts.title,
        description: opts.description,
        variant: 'success',
        duration: opts.duration,
      }),
    error: (opts: {
      title?: string
      description?: string
      duration?: number
    }) =>
      addToast({
        title: opts.title,
        description: opts.description,
        variant: 'destructive',
        duration: opts.duration,
      }),
  }
}
