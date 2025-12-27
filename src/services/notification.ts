import * as React from 'react'

import type { Todo } from '../features/todos/types'

// Check if browser supports notifications
export const supportsNotifications = () => {
  return 'Notification' in window
}

// Request notification permission
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!supportsNotifications()) return false

  if (Notification.permission === 'granted') return true

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }

  return false
}

// Show a notification
export const showNotification = (
  title: string,
  options?: NotificationOptions,
) => {
  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options,
    })

    // Auto close after 10 seconds
    setTimeout(() => notification.close(), 10000)

    return notification
  }
  return null
}

// Format reminder time for display
export const formatReminderTime = (reminder: string): string => {
  switch (reminder) {
    case '5min':
      return '5 phút trước'
    case '10min':
      return '10 phút trước'
    case '15min':
      return '15 phút trước'
    case '30min':
      return '30 phút trước'
    case '1hour':
      return '1 giờ trước'
    case '2hours':
      return '2 giờ trước'
    case '1day':
      return '1 ngày trước'
    default:
      return reminder
  }
}

// Get reminder options for dropdown
export const getReminderOptions = () => [
  { value: '', label: 'Không nhắc' },
  { value: '5min', label: '5 phút trước' },
  { value: '10min', label: '10 phút trước' },
  { value: '15min', label: '15 phút trước' },
  { value: '30min', label: '30 phút trước' },
  { value: '1hour', label: '1 giờ trước' },
  { value: '2hours', label: '2 giờ trước' },
  { value: '1day', label: '1 ngày trước' },
]

// Hook to manage notifications
export function useNotifications(todos: Todo[]) {
  const [hasPermission, setHasPermission] = React.useState(false)
  const notifiedTodosRef = React.useRef<Set<number>>(new Set())

  // Request permission on mount
  React.useEffect(() => {
    requestNotificationPermission().then(setHasPermission)
  }, [])

  // Check for due reminders
  React.useEffect(() => {
    if (!hasPermission) return

    const checkReminders = () => {
      const now = new Date()

      todos.forEach((todo) => {
        if (todo.completed) return
        if (!todo.reminderTime) return
        if (notifiedTodosRef.current.has(todo.id)) return

        // Calculate reminder time
        let reminderDate: Date | null = null
        const dueDate = todo.dueDate || 'today'

        // Get the actual due date
        let actualDueDate = new Date()
        if (dueDate === 'today') {
          actualDueDate.setHours(23, 59, 59, 999)
        } else if (dueDate === 'tomorrow') {
          actualDueDate.setDate(actualDueDate.getDate() + 1)
          actualDueDate.setHours(23, 59, 59, 999)
        } else {
          actualDueDate = new Date(dueDate)
        }

        // Calculate when to show reminder based on reminderTime
        reminderDate = new Date(actualDueDate)
        switch (todo.reminderTime) {
          case '5min':
            reminderDate.setMinutes(reminderDate.getMinutes() - 5)
            break
          case '10min':
            reminderDate.setMinutes(reminderDate.getMinutes() - 10)
            break
          case '15min':
            reminderDate.setMinutes(reminderDate.getMinutes() - 15)
            break
          case '30min':
            reminderDate.setMinutes(reminderDate.getMinutes() - 30)
            break
          case '1hour':
            reminderDate.setHours(reminderDate.getHours() - 1)
            break
          case '2hours':
            reminderDate.setHours(reminderDate.getHours() - 2)
            break
          case '1day':
            reminderDate.setDate(reminderDate.getDate() - 1)
            break
          default:
            // Try to parse as ISO date
            try {
              reminderDate = new Date(todo.reminderTime)
            } catch {
              return
            }
        }

        // Check if it's time to show the notification
        if (reminderDate && now >= reminderDate) {
          showNotification(`⏰ Nhắc nhở: ${todo.todo}`, {
            body: `Công việc "${todo.todo}" sắp đến hạn!`,
            tag: `todo-${todo.id}`,
            requireInteraction: true,
          })
          notifiedTodosRef.current.add(todo.id)
        }
      })
    }

    // Check immediately and then every minute
    checkReminders()
    const interval = setInterval(checkReminders, 60000)

    return () => clearInterval(interval)
  }, [todos, hasPermission])

  return {
    hasPermission,
    requestPermission: requestNotificationPermission,
    showNotification,
  }
}
