import * as Dialog from '@radix-ui/react-dialog'
import * as React from 'react'

import { cn } from '@/utils/cn'

import { useTodoStore } from '../store'
import type { Todo, SubTask } from '../types'

interface TaskDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  todo: Todo | null
  onUpdate?: (id: number, updates: Partial<Todo>) => void
}

const STAGES = [
  { id: 'pending', name: 'Đang chờ', color: 'bg-yellow-500' },
  { id: 'in-progress', name: 'Đang làm', color: 'bg-blue-500' },
  { id: 'completed', name: 'Hoàn thành', color: 'bg-emerald-500' },
]

const PRIORITIES = [
  { id: 'high', name: 'CAO', color: 'bg-red-500 text-white' },
  { id: 'medium', name: 'TRUNG BÌNH', color: 'bg-orange-500 text-white' },
  { id: 'low', name: 'THẤP', color: 'bg-blue-500 text-white' },
]

const PROJECTS = [
  {
    id: 'work',
    name: 'Công việc',
    color: 'bg-blue-100 text-blue-600 border-blue-200',
  },
  {
    id: 'personal',
    name: 'Cá nhân',
    color: 'bg-emerald-100 text-emerald-600 border-emerald-200',
  },
  {
    id: 'shopping',
    name: 'Mua sắm',
    color: 'bg-purple-100 text-purple-600 border-purple-200',
  },
]

const ASSIGNEES = [
  { id: '1', name: 'Bạn', initial: 'B', color: 'bg-primary' },
  { id: '2', name: 'Minh Tuấn', initial: 'MT', color: 'bg-emerald-500' },
  { id: '3', name: 'Hồng Nhung', initial: 'HN', color: 'bg-pink-500' },
]

interface Attachment {
  id: string
  name: string
  size: string
  type: string
}

export function TaskDetailModal({
  open,
  onOpenChange,
  todo,
  onUpdate,
}: TaskDetailModalProps) {
  const { getTodoMetadata, updateLocalTodo } = useTodoStore()

  const [description, setDescription] = React.useState('')
  const [subTasks, setSubTasks] = React.useState<SubTask[]>([])
  const [newSubTaskText, setNewSubTaskText] = React.useState('')
  const [showSubTaskInput, setShowSubTaskInput] = React.useState(false)
  const [tags, setTags] = React.useState<string[]>([])
  const [attachments, setAttachments] = React.useState<Attachment[]>([])
  const [hasChanges, setHasChanges] = React.useState(false)
  const [showShareMenu, setShowShareMenu] = React.useState(false)
  const [showMoreMenu, setShowMoreMenu] = React.useState(false)
  const [copied, setCopied] = React.useState(false)

  // Dropdowns
  const [showStageDropdown, setShowStageDropdown] = React.useState(false)
  const [showPriorityDropdown, setShowPriorityDropdown] = React.useState(false)
  const [showAssigneeDropdown, setShowAssigneeDropdown] = React.useState(false)
  const [showDatePicker, setShowDatePicker] = React.useState(false)
  const [showTagDropdown, setShowTagDropdown] = React.useState(false)

  // File input ref
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // Get metadata
  const metadata = todo ? getTodoMetadata(todo.id) : null
  const [currentProject, setCurrentProject] = React.useState(
    todo?.project || metadata?.project || 'personal',
  )
  const [currentDueDate, setCurrentDueDate] = React.useState(
    todo?.dueDate || metadata?.dueDate || 'today',
  )
  const [currentPriority, setCurrentPriority] = React.useState(
    todo?.priority || metadata?.priority || 'medium',
  )
  const [currentAssignee, setCurrentAssignee] = React.useState('1')

  // Initialize when todo changes
  React.useEffect(() => {
    if (todo && open) {
      const meta = getTodoMetadata(todo.id)
      setDescription(todo.description || '')
      setSubTasks(todo.subTasks || [])
      setCurrentProject(todo.project || meta?.project || 'personal')
      setCurrentDueDate(todo.dueDate || meta?.dueDate || 'today')
      setCurrentPriority(todo.priority || meta?.priority || 'medium')
      setTags([todo.project || meta?.project || 'personal'])
      setHasChanges(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todo?.id, open])

  if (!todo) return null

  const stage = todo.completed
    ? 'completed'
    : currentDueDate === 'today'
      ? 'in-progress'
      : 'pending'
  const stageInfo = STAGES.find((s) => s.id === stage) || STAGES[0]
  const priorityInfo =
    PRIORITIES.find((p) => p.id === currentPriority) || PRIORITIES[1]
  const assigneeInfo =
    ASSIGNEES.find((a) => a.id === currentAssignee) || ASSIGNEES[0]

  const completedSubTasks = subTasks.filter((st) => st.completed).length

  const formatDate = (date: string) => {
    if (date === 'today') {
      const d = new Date()
      return d.toLocaleDateString('vi-VN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    }
    if (date === 'tomorrow') {
      const d = new Date()
      d.setDate(d.getDate() + 1)
      return d.toLocaleDateString('vi-VN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    }
    return new Date(date).toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const createdDate = todo.createdAt
    ? new Date(todo.createdAt).toLocaleDateString('vi-VN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('vi-VN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })

  const closeAllDropdowns = () => {
    setShowStageDropdown(false)
    setShowPriorityDropdown(false)
    setShowAssigneeDropdown(false)
    setShowDatePicker(false)
    setShowTagDropdown(false)
    setShowShareMenu(false)
    setShowMoreMenu(false)
  }

  const handleToggleComplete = () => {
    const newCompleted = !todo.completed
    if (todo.createdAt) {
      updateLocalTodo(todo.id, { completed: newCompleted })
    }
    onUpdate?.(todo.id, { completed: newCompleted })
  }

  const handleToggleSubTask = (subTaskId: string) => {
    setSubTasks((prev) =>
      prev.map((st) =>
        st.id === subTaskId ? { ...st, completed: !st.completed } : st,
      ),
    )
    setHasChanges(true)
  }

  const handleAddSubTask = () => {
    if (!newSubTaskText.trim()) return
    setSubTasks((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: newSubTaskText.trim(),
        completed: false,
      },
    ])
    setNewSubTaskText('')
    setShowSubTaskInput(false)
    setHasChanges(true)
  }

  const handleDeleteSubTask = (subTaskId: string) => {
    setSubTasks((prev) => prev.filter((st) => st.id !== subTaskId))
    setHasChanges(true)
  }

  const handleStageChange = (newStage: string) => {
    const newCompleted = newStage === 'completed'
    if (todo.createdAt) {
      updateLocalTodo(todo.id, { completed: newCompleted })
    }
    onUpdate?.(todo.id, { completed: newCompleted })
    closeAllDropdowns()
  }

  const handlePriorityChange = (newPriority: string) => {
    setCurrentPriority(newPriority as 'high' | 'medium' | 'low')
    if (todo.createdAt) {
      updateLocalTodo(todo.id, {
        priority: newPriority as 'high' | 'medium' | 'low',
      })
    }
    onUpdate?.(todo.id, { priority: newPriority as 'high' | 'medium' | 'low' })
    closeAllDropdowns()
  }

  const handleDateChange = (newDate: string) => {
    setCurrentDueDate(newDate)
    if (todo.createdAt) {
      updateLocalTodo(todo.id, { dueDate: newDate })
    }
    onUpdate?.(todo.id, { dueDate: newDate as 'today' | 'tomorrow' })
    closeAllDropdowns()
  }

  const handleAssigneeChange = (assigneeId: string) => {
    setCurrentAssignee(assigneeId)
    closeAllDropdowns()
  }

  const handleAddTag = (projectId: string) => {
    if (!tags.includes(projectId)) {
      setTags((prev) => [...prev, projectId])
      setCurrentProject(projectId)
      if (todo.createdAt) {
        updateLocalTodo(todo.id, { project: projectId })
      }
      onUpdate?.(todo.id, { project: projectId })
    }
    closeAllDropdowns()
  }

  const handleRemoveTag = (projectId: string) => {
    setTags((prev) => prev.filter((t) => t !== projectId))
    setHasChanges(true)
  }

  const handleDescriptionChange = (value: string) => {
    setDescription(value)
    setHasChanges(true)
  }

  // Save all changes
  const handleSave = () => {
    if (todo.createdAt) {
      updateLocalTodo(todo.id, {
        description,
        subTasks,
        project: currentProject,
        dueDate: currentDueDate,
        priority: currentPriority as 'high' | 'medium' | 'low',
      })
    }
    onUpdate?.(todo.id, {
      description,
      subTasks,
      project: currentProject,
      dueDate: currentDueDate as 'today' | 'tomorrow',
      priority: currentPriority as 'high' | 'medium' | 'low',
    })
    setHasChanges(false)
  }

  // File upload
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const newAttachments: Attachment[] = Array.from(files).map((file) => ({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: formatFileSize(file.size),
        type: file.type,
      }))
      setAttachments((prev) => [...prev, ...newAttachments])
      setHasChanges(true)
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleDeleteAttachment = (attachmentId: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== attachmentId))
    setHasChanges(true)
  }

  // Share functionality
  const handleCopyLink = () => {
    const link = `${window.location.origin}/task/${todo.id}`
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // More actions
  const handleDuplicate = () => {
    // Duplicate task logic
    const newTodo = {
      ...todo,
      id: Date.now(),
      todo: todo.todo + ' (Bản sao)',
      createdAt: new Date().toISOString(),
    }
    if (todo.createdAt) {
      useTodoStore.getState().addLocalTodo(newTodo)
    }
    closeAllDropdowns()
    onOpenChange(false)
  }

  const handleArchive = () => {
    // Archive - just mark as completed and close
    if (todo.createdAt) {
      updateLocalTodo(todo.id, { completed: true })
    }
    onUpdate?.(todo.id, { completed: true })
    closeAllDropdowns()
    onOpenChange(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 bg-black/40 z-50"
          onClick={closeAllDropdowns}
        />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">
                check_circle
              </span>
              <span className="text-sm font-medium text-slate-500">
                TASK-{todo.id}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {/* Share Button */}
              <div className="relative">
                <button
                  onClick={() => {
                    closeAllDropdowns()
                    setShowShareMenu(!showShareMenu)
                  }}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                  title="Chia sẻ"
                >
                  <span className="material-symbols-outlined text-[20px] text-slate-500">
                    share
                  </span>
                </button>
                {showShareMenu && (
                  <div className="absolute top-full right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-20 min-w-[200px]">
                    <div className="p-3 border-b border-slate-200 dark:border-slate-700">
                      <p className="text-sm font-medium mb-2">
                        Chia sẻ công việc
                      </p>
                      <button
                        onClick={handleCopyLink}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          link
                        </span>
                        {copied ? 'Đã sao chép!' : 'Sao chép liên kết'}
                      </button>
                      <button className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                        <span className="material-symbols-outlined text-[18px]">
                          mail
                        </span>
                        Gửi qua email
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* More Options Button */}
              <div className="relative">
                <button
                  onClick={() => {
                    closeAllDropdowns()
                    setShowMoreMenu(!showMoreMenu)
                  }}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                  title="Thêm tùy chọn"
                >
                  <span className="material-symbols-outlined text-[20px] text-slate-500">
                    more_horiz
                  </span>
                </button>
                {showMoreMenu && (
                  <div className="absolute top-full right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-20 min-w-[180px] py-1">
                    <button
                      onClick={handleDuplicate}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        content_copy
                      </span>
                      Nhân bản
                    </button>
                    <button
                      onClick={handleArchive}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        archive
                      </span>
                      Lưu trữ
                    </button>
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700">
                      <span className="material-symbols-outlined text-[18px]">
                        print
                      </span>
                      In
                    </button>
                    <div className="border-t border-slate-200 dark:border-slate-700 my-1"></div>
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                      <span className="material-symbols-outlined text-[18px]">
                        delete
                      </span>
                      Xóa
                    </button>
                  </div>
                )}
              </div>

              <Dialog.Close asChild>
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                  <span className="material-symbols-outlined text-[20px] text-slate-500">
                    close
                  </span>
                </button>
              </Dialog.Close>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto flex">
            {/* Main Content */}
            <div className="flex-1 p-6">
              {/* Title with Checkbox */}
              <div className="flex items-start gap-4 mb-2">
                <button onClick={handleToggleComplete} className="mt-1">
                  <div
                    className={cn(
                      'size-6 rounded border-2 flex items-center justify-center',
                      todo.completed
                        ? 'bg-primary border-primary'
                        : 'border-slate-300 hover:border-primary/60',
                    )}
                  >
                    {todo.completed && (
                      <span className="material-symbols-outlined text-white text-[16px]">
                        check
                      </span>
                    )}
                  </div>
                </button>
                <div>
                  <h2
                    className={cn(
                      'text-2xl font-bold text-slate-900 dark:text-white',
                      todo.completed && 'line-through text-slate-400',
                    )}
                  >
                    {todo.todo}
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Tạo bởi{' '}
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      Bạn
                    </span>{' '}
                    vào {createdDate}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-[20px] text-slate-400">
                    description
                  </span>
                  <h3 className="font-semibold text-slate-800 dark:text-white">
                    Mô tả
                  </h3>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 min-h-[100px]">
                  <textarea
                    value={description}
                    onChange={(e) => handleDescriptionChange(e.target.value)}
                    placeholder="Thêm mô tả chi tiết cho công việc..."
                    className="w-full bg-transparent text-slate-700 dark:text-slate-300 text-sm outline-none resize-none min-h-[80px]"
                  />
                  <div className="flex items-center gap-2 mt-2 border-t border-slate-200 dark:border-slate-700 pt-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
                      title="Đính kèm tệp"
                    >
                      <span className="material-symbols-outlined text-[18px] text-slate-400">
                        attach_file
                      </span>
                    </button>
                    <button
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
                      title="In đậm"
                    >
                      <span className="material-symbols-outlined text-[18px] text-slate-400 font-bold">
                        format_bold
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Sub-tasks */}
              <div className="mt-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-[20px] text-slate-400">
                    checklist
                  </span>
                  <h3 className="font-semibold text-slate-800 dark:text-white">
                    Công việc con
                  </h3>
                  {subTasks.length > 0 && (
                    <span className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full text-slate-600 dark:text-slate-400">
                      {completedSubTasks}/{subTasks.length}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  {subTasks.map((subTask) => (
                    <div
                      key={subTask.id}
                      className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg group"
                    >
                      <button onClick={() => handleToggleSubTask(subTask.id)}>
                        <div
                          className={cn(
                            'size-5 rounded border-2 flex items-center justify-center',
                            subTask.completed
                              ? 'bg-primary border-primary'
                              : 'border-slate-300 hover:border-primary/60',
                          )}
                        >
                          {subTask.completed && (
                            <span className="material-symbols-outlined text-white text-[14px]">
                              check
                            </span>
                          )}
                        </div>
                      </button>
                      <span
                        className={cn(
                          'flex-1 text-sm text-slate-700 dark:text-slate-300',
                          subTask.completed && 'line-through text-slate-400',
                        )}
                      >
                        {subTask.text}
                      </span>
                      <button
                        onClick={() => handleDeleteSubTask(subTask.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded text-red-500"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          close
                        </span>
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Sub-task */}
                {showSubTaskInput ? (
                  <div className="mt-3 flex items-center gap-2">
                    <input
                      type="text"
                      value={newSubTaskText}
                      onChange={(e) => setNewSubTaskText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddSubTask()}
                      placeholder="Nhập tên công việc con..."
                      className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800"
                      // eslint-disable-next-line jsx-a11y/no-autofocus
                      autoFocus
                    />
                    <button
                      onClick={handleAddSubTask}
                      className="px-3 py-2 bg-primary text-white rounded-lg text-sm font-medium"
                    >
                      Thêm
                    </button>
                    <button
                      onClick={() => {
                        setShowSubTaskInput(false)
                        setNewSubTaskText('')
                      }}
                      className="px-3 py-2 text-slate-500 hover:bg-slate-100 rounded-lg text-sm"
                    >
                      Hủy
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowSubTaskInput(true)}
                    className="mt-3 text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      add
                    </span>
                    Thêm công việc con
                  </button>
                )}
              </div>

              {/* Save Button */}
              {hasChanges && (
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-primary/90"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      save
                    </span>
                    Lưu thay đổi
                  </button>
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="w-72 border-l border-slate-200 dark:border-slate-800 p-6 bg-slate-50 dark:bg-slate-800/50">
              {/* Stage */}
              <div className="mb-6">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Trạng thái
                </h4>
                <div className="relative">
                  <button
                    onClick={() => {
                      closeAllDropdowns()
                      setShowStageDropdown(!showStageDropdown)
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={cn('w-2 h-2 rounded-full', stageInfo.color)}
                      ></span>
                      <span className="text-sm font-medium">
                        {stageInfo.name}
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-[18px] text-slate-400">
                      expand_more
                    </span>
                  </button>

                  {showStageDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-10">
                      {STAGES.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => handleStageChange(s.id)}
                          className={cn(
                            'w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 first:rounded-t-lg last:rounded-b-lg',
                            stage === s.id && 'bg-primary/10',
                          )}
                        >
                          <span
                            className={cn('w-2 h-2 rounded-full', s.color)}
                          ></span>
                          <span className="text-sm">{s.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Due Date */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-[18px] text-primary">
                    event
                  </span>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Ngày đến hạn
                  </h4>
                </div>
                <div className="relative">
                  <button
                    onClick={() => {
                      closeAllDropdowns()
                      setShowDatePicker(!showDatePicker)
                    }}
                    className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary cursor-pointer"
                  >
                    {formatDate(currentDueDate)}
                  </button>

                  {showDatePicker && (
                    <div className="absolute top-full left-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-10 p-2 min-w-[150px]">
                      <button
                        onClick={() => handleDateChange('today')}
                        className={cn(
                          'w-full px-3 py-2 text-left text-sm hover:bg-slate-100 rounded',
                          currentDueDate === 'today' && 'bg-primary/10',
                        )}
                      >
                        📅 Hôm nay
                      </button>
                      <button
                        onClick={() => handleDateChange('tomorrow')}
                        className={cn(
                          'w-full px-3 py-2 text-left text-sm hover:bg-slate-100 rounded',
                          currentDueDate === 'tomorrow' && 'bg-primary/10',
                        )}
                      >
                        🌅 Ngày mai
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Priority */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-[18px] text-primary">
                    flag
                  </span>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Độ ưu tiên
                  </h4>
                </div>
                <div className="relative">
                  <button
                    onClick={() => {
                      closeAllDropdowns()
                      setShowPriorityDropdown(!showPriorityDropdown)
                    }}
                    className={cn(
                      'inline-flex items-center px-2 py-1 rounded text-xs font-bold uppercase cursor-pointer',
                      priorityInfo.color,
                    )}
                  >
                    {currentPriority === 'high' && '! '}
                    {priorityInfo.name}
                  </button>

                  {showPriorityDropdown && (
                    <div className="absolute top-full left-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-10 p-1 min-w-[130px]">
                      {PRIORITIES.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => handlePriorityChange(p.id)}
                          className={cn(
                            'w-full px-3 py-2 text-left text-sm hover:bg-slate-100 rounded flex items-center gap-2',
                            currentPriority === p.id && 'bg-primary/10',
                          )}
                        >
                          <span
                            className={cn(
                              'px-2 py-0.5 rounded text-[10px] font-bold',
                              p.color,
                            )}
                          >
                            {p.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Assignee */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-[18px] text-primary">
                    person
                  </span>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Người thực hiện
                  </h4>
                </div>
                <div className="relative">
                  <button
                    onClick={() => {
                      closeAllDropdowns()
                      setShowAssigneeDropdown(!showAssigneeDropdown)
                    }}
                    className="flex items-center gap-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 p-1 rounded-lg -ml-1"
                  >
                    <div
                      className={cn(
                        'w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium',
                        assigneeInfo.color,
                      )}
                    >
                      {assigneeInfo.initial}
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {assigneeInfo.name}
                    </span>
                  </button>

                  {showAssigneeDropdown && (
                    <div className="absolute top-full left-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-10 p-1 min-w-[150px]">
                      {ASSIGNEES.map((a) => (
                        <button
                          key={a.id}
                          onClick={() => handleAssigneeChange(a.id)}
                          className={cn(
                            'w-full px-3 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 rounded flex items-center gap-2',
                            currentAssignee === a.id && 'bg-primary/10',
                          )}
                        >
                          <div
                            className={cn(
                              'w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-medium',
                              a.color,
                            )}
                          >
                            {a.initial}
                          </div>
                          <span>{a.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div className="mb-6">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Nhãn
                </h4>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tagId) => {
                    const tagInfo = PROJECTS.find((p) => p.id === tagId)
                    if (!tagInfo) return null
                    return (
                      <span
                        key={tagId}
                        className={cn(
                          'inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border',
                          tagInfo.color,
                        )}
                      >
                        # {tagInfo.name}
                        <button
                          onClick={() => handleRemoveTag(tagId)}
                          className="hover:text-red-500"
                        >
                          <span className="material-symbols-outlined text-[12px]">
                            close
                          </span>
                        </button>
                      </span>
                    )
                  })}
                  <div className="relative">
                    <button
                      onClick={() => {
                        closeAllDropdowns()
                        setShowTagDropdown(!showTagDropdown)
                      }}
                      className="inline-flex items-center px-2 py-1 rounded text-xs font-medium border border-dashed border-slate-300 text-slate-500 hover:border-primary hover:text-primary"
                    >
                      + Thêm nhãn
                    </button>

                    {showTagDropdown && (
                      <div className="absolute top-full left-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-10 p-1 min-w-[130px]">
                        {PROJECTS.filter((p) => !tags.includes(p.id)).map(
                          (p) => (
                            <button
                              key={p.id}
                              onClick={() => handleAddTag(p.id)}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 rounded flex items-center gap-2"
                            >
                              <span
                                className={cn(
                                  'px-2 py-0.5 rounded text-[10px] border',
                                  p.color,
                                )}
                              >
                                # {p.name}
                              </span>
                            </button>
                          ),
                        )}
                        {PROJECTS.filter((p) => !tags.includes(p.id)).length ===
                          0 && (
                          <p className="px-3 py-2 text-sm text-slate-400">
                            Đã thêm tất cả
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Attachments */}
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Tệp đính kèm
                </h4>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  accept="*/*"
                />

                {attachments.length > 0 ? (
                  <div className="space-y-2 mb-3">
                    {attachments.map((attachment) => (
                      <div
                        key={attachment.id}
                        className="flex items-center gap-2 p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 group"
                      >
                        <span className="material-symbols-outlined text-[20px] text-slate-400">
                          description
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                            {attachment.name}
                          </p>
                          <p className="text-xs text-slate-400">
                            {attachment.size}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteAttachment(attachment.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded text-red-500"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            close
                          </span>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-slate-500 italic mb-2">
                    Chưa có tệp đính kèm
                  </div>
                )}

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    attach_file
                  </span>
                  Thêm tệp
                </button>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
