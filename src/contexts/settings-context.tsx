import * as React from 'react'

type Theme = 'light' | 'dark' | 'system'
type Language = 'vi' | 'en'

interface SettingsState {
  theme: Theme
  language: Language
  setTheme: (theme: Theme) => void
  setLanguage: (language: Language) => void
}

const SettingsContext = React.createContext<SettingsState | null>(null)

// Get system preference
const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  }
  return 'light'
}

// Apply theme to document
const applyTheme = (theme: Theme) => {
  const html = document.documentElement
  const body = document.body
  const effectiveTheme = theme === 'system' ? getSystemTheme() : theme

  if (effectiveTheme === 'dark') {
    html.classList.add('dark')
    body.classList.add('dark')
    // Also set data attribute for extra specificity
    html.setAttribute('data-theme', 'dark')
  } else {
    html.classList.remove('dark')
    body.classList.remove('dark')
    html.setAttribute('data-theme', 'light')
  }
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as Theme) || 'system'
    }
    return 'system'
  })

  const [language, setLanguageState] = React.useState<Language>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('language') as Language) || 'vi'
    }
    return 'vi'
  })

  // Apply theme on mount and when it changes
  React.useEffect(() => {
    applyTheme(theme)
  }, [theme])

  // Listen for system theme changes
  React.useEffect(() => {
    if (theme !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => applyTheme('system')

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [theme])

  const setTheme = React.useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem('theme', newTheme)
    applyTheme(newTheme)
  }, [])

  const setLanguage = React.useCallback((newLanguage: Language) => {
    setLanguageState(newLanguage)
    localStorage.setItem('language', newLanguage)
  }, [])

  return (
    <SettingsContext.Provider
      value={{ theme, language, setTheme, setLanguage }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = React.useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider')
  }
  return context
}

// Translations
const translations = {
  vi: {
    // Common
    settings: 'Cài đặt',
    save: 'Lưu',
    cancel: 'Hủy',
    close: 'Đóng',

    // Theme
    theme: 'Giao diện',
    themeLight: 'Sáng',
    themeDark: 'Tối',
    themeSystem: 'Theo hệ thống',

    // Language
    language: 'Ngôn ngữ',
    languageVi: 'Tiếng Việt',
    languageEn: 'English',

    // Settings sections
    appearance: 'Giao diện',
    general: 'Chung',
    notifications: 'Thông báo',

    // Navigation
    today: 'Hôm nay',
    tomorrow: 'Ngày mai',
    upcoming: 'Sắp tới',
    overdue: 'Quá hạn',
    allTasks: 'Tất cả',
    completed: 'Hoàn thành',

    // Tasks
    addTask: 'Thêm công việc mới',
    deleteTask: 'Xóa',
    editTask: 'Chỉnh sửa',
    taskDeleted: 'Đã xóa công việc',
    undo: 'Hoàn tác',

    // Priority
    priorityHigh: 'Cao',
    priorityMedium: 'Trung bình',
    priorityLow: 'Thấp',

    // Projects
    projects: 'Dự án',
    work: 'Công việc',
    personal: 'Cá nhân',
    shopping: 'Mua sắm',

    // Reminder
    reminder: 'Nhắc nhở',
    noReminder: 'Không nhắc',

    // Recurrence
    recurrence: 'Lặp lại',
    noRecurrence: 'Không lặp',
    daily: 'Hàng ngày',
    weekdays: 'Ngày trong tuần',
    weekly: 'Hàng tuần',
    monthly: 'Hàng tháng',
  },
  en: {
    // Common
    settings: 'Settings',
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',

    // Theme
    theme: 'Theme',
    themeLight: 'Light',
    themeDark: 'Dark',
    themeSystem: 'System',

    // Language
    language: 'Language',
    languageVi: 'Tiếng Việt',
    languageEn: 'English',

    // Settings sections
    appearance: 'Appearance',
    general: 'General',
    notifications: 'Notifications',

    // Navigation
    today: 'Today',
    tomorrow: 'Tomorrow',
    upcoming: 'Upcoming',
    overdue: 'Overdue',
    allTasks: 'All Tasks',
    completed: 'Completed',

    // Tasks
    addTask: 'Add new task',
    deleteTask: 'Delete',
    editTask: 'Edit',
    taskDeleted: 'Task deleted',
    undo: 'Undo',

    // Priority
    priorityHigh: 'High',
    priorityMedium: 'Medium',
    priorityLow: 'Low',

    // Projects
    projects: 'Projects',
    work: 'Work',
    personal: 'Personal',
    shopping: 'Shopping',

    // Reminder
    reminder: 'Reminder',
    noReminder: 'No reminder',

    // Recurrence
    recurrence: 'Recurrence',
    noRecurrence: 'No repeat',
    daily: 'Daily',
    weekdays: 'Weekdays',
    weekly: 'Weekly',
    monthly: 'Monthly',
  },
}

export type TranslationKey = keyof typeof translations.vi

export function useTranslation() {
  const { language } = useSettings()

  const t = React.useCallback(
    (key: TranslationKey): string => {
      return translations[language][key] || key
    },
    [language],
  )

  return { t, language }
}
