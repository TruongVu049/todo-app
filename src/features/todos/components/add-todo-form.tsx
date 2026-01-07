import * as React from 'react'

import { getReminderOptions, formatReminderTime } from '@/services/notification'
import { cn } from '@/utils/cn'

import { useTodoStore } from '../store'

interface AddTodoFormProps {
  inputRef?: React.RefObject<HTMLInputElement | null>
  currentProject?: string
}

const PROJECTS = [
  { id: 'work', name: 'Công việc', color: 'bg-blue-500' },
  { id: 'personal', name: 'Cá nhân', color: 'bg-emerald-500' },
  { id: 'shopping', name: 'Mua sắm', color: 'bg-purple-500' },
]

const PRIORITIES = [
  {
    id: 'high',
    name: 'Cao',
    color: 'text-red-500',
    bgColor: 'bg-red-50 border-red-200',
    icon: '🔴',
  },
  {
    id: 'medium',
    name: 'Trung bình',
    color: 'text-orange-500',
    bgColor: 'bg-orange-50 border-orange-200',
    icon: '🟡',
  },
  {
    id: 'low',
    name: 'Thấp',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 border-blue-200',
    icon: '🔵',
  },
]

const RECURRENCE_OPTIONS = [
  { id: 'none', name: 'Không lặp', icon: 'event' },
  { id: 'daily', name: 'Hàng ngày', icon: 'today' },
  { id: 'weekdays', name: 'Ngày trong tuần', icon: 'date_range' },
  { id: 'weekly', name: 'Hàng tuần', icon: 'calendar_view_week' },
  { id: 'monthly', name: 'Hàng tháng', icon: 'calendar_month' },
]

// Generate next 7 days for calendar
const getNextDays = () => {
  const days = []
  const today = new Date()
  const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

  for (let i = 0; i < 7; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    days.push({
      date: date,
      dayName: dayNames[date.getDay()],
      dayNum: date.getDate(),
      month: date.getMonth() + 1,
      isToday: i === 0,
      isTomorrow: i === 1,
      dateString: date.toISOString().split('T')[0],
    })
  }
  return days
}

export function AddTodoForm({ inputRef, currentProject }: AddTodoFormProps) {
  const [text, setText] = React.useState('')
  const [selectedDate, setSelectedDate] = React.useState<string>('today')
  const [selectedProject, setSelectedProject] = React.useState(
    currentProject || 'personal',
  )
  const [selectedPriority, setSelectedPriority] = React.useState('medium')
  const [showDatePicker, setShowDatePicker] = React.useState(false)
  const [showProjectPicker, setShowProjectPicker] = React.useState(false)
  const [showPriorityPicker, setShowPriorityPicker] = React.useState(false)
  const [showReminderPicker, setShowReminderPicker] = React.useState(false)
  const [selectedReminder, setSelectedReminder] = React.useState('')
  const [showRecurrencePicker, setShowRecurrencePicker] = React.useState(false)
  const [selectedRecurrence, setSelectedRecurrence] = React.useState('none')
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const addLocalTodo = useTodoStore((s) => s.addLocalTodo)
  const localRef = React.useRef<HTMLInputElement>(null)
  const ref = inputRef || localRef

  const nextDays = React.useMemo(() => getNextDays(), [])
  const todayStr = nextDays[0].dateString
  const tomorrowStr = nextDays[1].dateString

  React.useEffect(() => {
    if (currentProject && currentProject !== 'none') {
      setSelectedProject(currentProject)
    }
  }, [currentProject])

  const closeAllPickers = () => {
    setShowDatePicker(false)
    setShowProjectPicker(false)
    setShowPriorityPicker(false)
    setShowReminderPicker(false)
    setShowRecurrencePicker(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim() || isSubmitting) return

    setIsSubmitting(true)

    // Normalize date
    let normalizedDate = selectedDate
    if (selectedDate === todayStr) {
      normalizedDate = 'today'
    } else if (selectedDate === tomorrowStr) {
      normalizedDate = 'tomorrow'
    }

    const newId = Date.now()
    const newTodo = {
      id: newId,
      todo: text.trim(),
      completed: false,
      userId: 1,
      dueDate: normalizedDate,
      project: selectedProject,
      priority: selectedPriority as 'high' | 'medium' | 'low',
      createdAt: new Date().toISOString(),
      reminderTime: selectedReminder || undefined,
      recurrence:
        selectedRecurrence !== 'none'
          ? (selectedRecurrence as 'daily' | 'weekdays' | 'weekly' | 'monthly')
          : undefined,
    }

    addLocalTodo(newTodo)

    setText('')
    setIsSubmitting(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const getDateLabel = () => {
    if (selectedDate === 'today' || selectedDate === todayStr) return 'Hôm nay'
    if (selectedDate === 'tomorrow' || selectedDate === tomorrowStr)
      return 'Ngày mai'
    const date = new Date(selectedDate)
    return `${date.getDate()}/${date.getMonth() + 1}`
  }

  const selectedProjectInfo =
    PROJECTS.find((p) => p.id === selectedProject) || PROJECTS[1]
  const selectedPriorityInfo =
    PRIORITIES.find((p) => p.id === selectedPriority) || PRIORITIES[1]

  return (
    <div className="space-y-3">
      {/* Input Row */}
      <div className="relative flex items-center gap-2 md:gap-3 bg-white dark:bg-[#1e2736] border border-slate-200 dark:border-slate-700 rounded-xl p-2 shadow-sm focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary/50">
        {/* Plus Icon */}
        <div className="flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-lg bg-primary/10 text-primary shrink-0">
          <span className="material-symbols-outlined text-[18px] md:text-[20px]">
            add
          </span>
        </div>

        {/* Input */}
        <input
          ref={ref as React.RefObject<HTMLInputElement>}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Thêm công việc mới... (Enter)"
          disabled={isSubmitting}
          className="flex-1 bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 text-sm md:text-[15px] outline-none disabled:opacity-50 min-w-0"
        />

        {/* Submit Button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!text.trim() || isSubmitting}
          className="px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 md:gap-1.5 shrink-0"
        >
          <span className="material-symbols-outlined text-[16px] md:text-[18px]">
            add_task
          </span>
          <span className="hidden md:inline">Thêm</span>
        </button>
      </div>

      {/* Options Row */}
      <div className="flex items-center gap-1.5 md:gap-2 flex-wrap">
        {/* Date Picker */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              closeAllPickers()
              setShowDatePicker(!showDatePicker)
            }}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5',
              selectedDate === 'today' || selectedDate === todayStr
                ? 'bg-primary/10 text-primary border-primary/30'
                : 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800',
            )}
          >
            <span className="material-symbols-outlined text-[16px]">event</span>
            {getDateLabel()}
            <span className="material-symbols-outlined text-[14px]">
              expand_more
            </span>
          </button>

          {showDatePicker && (
            <div className="absolute left-0 mt-1 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-3 z-50 min-w-[280px]">
              <p className="text-xs font-medium text-slate-500 mb-2">
                Chọn ngày
              </p>

              {/* Quick Options */}
              <div className="flex gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDate('today')
                    setShowDatePicker(false)
                  }}
                  className={cn(
                    'flex-1 px-3 py-2 rounded-lg text-sm font-medium border',
                    selectedDate === 'today' || selectedDate === todayStr
                      ? 'bg-primary text-white border-primary'
                      : 'border-slate-200 hover:bg-slate-50',
                  )}
                >
                  📅 Hôm nay
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDate('tomorrow')
                    setShowDatePicker(false)
                  }}
                  className={cn(
                    'flex-1 px-3 py-2 rounded-lg text-sm font-medium border',
                    selectedDate === 'tomorrow' || selectedDate === tomorrowStr
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'border-slate-200 hover:bg-slate-50',
                  )}
                >
                  🌅 Ngày mai
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
                <p className="text-xs font-medium text-slate-500 mb-2">
                  Hoặc chọn ngày cụ thể:
                </p>
                <div className="grid grid-cols-7 gap-1">
                  {nextDays.map((day) => (
                    <button
                      key={day.dateString}
                      type="button"
                      onClick={() => {
                        if (day.isToday) {
                          setSelectedDate('today')
                        } else if (day.isTomorrow) {
                          setSelectedDate('tomorrow')
                        } else {
                          setSelectedDate(day.dateString)
                        }
                        setShowDatePicker(false)
                      }}
                      className={cn(
                        'flex flex-col items-center p-2 rounded-lg text-xs',
                        selectedDate === day.dateString ||
                          (selectedDate === 'today' && day.isToday) ||
                          (selectedDate === 'tomorrow' && day.isTomorrow)
                          ? 'bg-primary text-white'
                          : day.isToday
                            ? 'bg-primary/10 text-primary hover:bg-primary/20'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-700',
                      )}
                    >
                      <span className="text-[10px] opacity-70">
                        {day.dayName}
                      </span>
                      <span className="font-semibold">{day.dayNum}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Project Picker */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              closeAllPickers()
              setShowProjectPicker(!showProjectPicker)
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 hover:border-primary/50 flex items-center gap-1.5"
          >
            <span
              className={cn('w-2 h-2 rounded-full', selectedProjectInfo.color)}
            ></span>
            {selectedProjectInfo.name}
            <span className="material-symbols-outlined text-[14px]">
              expand_more
            </span>
          </button>

          {showProjectPicker && (
            <div className="absolute left-0 mt-1 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-50 min-w-[140px]">
              {PROJECTS.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => {
                    setSelectedProject(project.id)
                    setShowProjectPicker(false)
                  }}
                  className={cn(
                    'w-full px-3 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2',
                    selectedProject === project.id && 'bg-primary/10',
                  )}
                >
                  <span
                    className={cn('w-2 h-2 rounded-full', project.color)}
                  ></span>
                  {project.name}
                  {selectedProject === project.id && (
                    <span className="ml-auto">✓</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Priority Picker */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              closeAllPickers()
              setShowPriorityPicker(!showPriorityPicker)
            }}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5',
              selectedPriorityInfo.bgColor,
            )}
          >
            <span>{selectedPriorityInfo.icon}</span>
            <span className={selectedPriorityInfo.color}>
              {selectedPriorityInfo.name}
            </span>
            <span className="material-symbols-outlined text-[14px]">
              expand_more
            </span>
          </button>

          {showPriorityPicker && (
            <div className="absolute left-0 mt-1 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-50 min-w-[150px]">
              {PRIORITIES.map((priority) => (
                <button
                  key={priority.id}
                  type="button"
                  onClick={() => {
                    setSelectedPriority(priority.id)
                    setShowPriorityPicker(false)
                  }}
                  className={cn(
                    'w-full px-3 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2',
                    selectedPriority === priority.id && 'bg-primary/10',
                  )}
                >
                  <span>{priority.icon}</span>
                  <span className={priority.color}>{priority.name}</span>
                  {selectedPriority === priority.id && (
                    <span className="ml-auto">✓</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Reminder Picker */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              closeAllPickers()
              setShowReminderPicker(!showReminderPicker)
            }}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5',
              selectedReminder
                ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400'
                : 'bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-700 dark:text-slate-400',
            )}
          >
            <span className="material-symbols-outlined text-[16px]">
              notifications
            </span>
            {selectedReminder
              ? formatReminderTime(selectedReminder)
              : 'Nhắc nhở'}
            <span className="material-symbols-outlined text-[14px]">
              expand_more
            </span>
          </button>

          {showReminderPicker && (
            <div className="absolute left-0 mt-1 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-50 min-w-[160px]">
              {getReminderOptions().map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setSelectedReminder(option.value)
                    setShowReminderPicker(false)
                  }}
                  className={cn(
                    'w-full px-3 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2',
                    selectedReminder === option.value && 'bg-primary/10',
                  )}
                >
                  <span className="material-symbols-outlined text-[16px] text-slate-400">
                    {option.value ? 'alarm' : 'alarm_off'}
                  </span>
                  {option.label}
                  {selectedReminder === option.value && (
                    <span className="ml-auto">✓</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Recurrence Picker */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              closeAllPickers()
              setShowRecurrencePicker(!showRecurrencePicker)
            }}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5',
              selectedRecurrence !== 'none'
                ? 'bg-violet-50 text-violet-600 border-violet-200 dark:bg-violet-900/20 dark:text-violet-400'
                : 'bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-700 dark:text-slate-400',
            )}
          >
            <span className="material-symbols-outlined text-[16px]">
              repeat
            </span>
            {RECURRENCE_OPTIONS.find((o) => o.id === selectedRecurrence)
              ?.name || 'Lặp lại'}
            <span className="material-symbols-outlined text-[14px]">
              expand_more
            </span>
          </button>

          {showRecurrencePicker && (
            <div className="absolute left-0 mt-1 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-50 min-w-[170px]">
              {RECURRENCE_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    setSelectedRecurrence(option.id)
                    setShowRecurrencePicker(false)
                  }}
                  className={cn(
                    'w-full px-3 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2',
                    selectedRecurrence === option.id && 'bg-primary/10',
                  )}
                >
                  <span className="material-symbols-outlined text-[16px] text-slate-400">
                    {option.icon}
                  </span>
                  {option.name}
                  {selectedRecurrence === option.id && (
                    <span className="ml-auto">✓</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
