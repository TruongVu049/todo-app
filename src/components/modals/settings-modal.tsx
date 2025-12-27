import * as React from 'react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useSettings } from '@/contexts/settings-context'
import { cn } from '@/utils/cn'

interface SettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type Theme = 'light' | 'dark' | 'system'
type Language = 'vi' | 'en'

const THEME_OPTIONS: { id: Theme; name: string; icon: string }[] = [
  { id: 'light', name: 'Sáng', icon: 'light_mode' },
  { id: 'dark', name: 'Tối', icon: 'dark_mode' },
  { id: 'system', name: 'Hệ thống', icon: 'settings_brightness' },
]

const LANGUAGE_OPTIONS: { id: Language; name: string; flag: string }[] = [
  { id: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { id: 'en', name: 'English', flag: '🇺🇸' },
]

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const { theme, language, setTheme, setLanguage } = useSettings()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <span className="material-symbols-outlined text-primary">
              settings
            </span>
            Cài đặt
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Theme Setting */}
          <div className="space-y-3">
            <span className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-slate-400">
                palette
              </span>
              Giao diện
            </span>
            <div className="grid grid-cols-3 gap-2">
              {THEME_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setTheme(option.id)}
                  className={cn(
                    'flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all',
                    theme === option.id
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-slate-200 dark:border-slate-700 hover:border-primary/50 text-slate-600 dark:text-slate-400',
                  )}
                >
                  <div
                    className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center',
                      theme === option.id
                        ? 'bg-primary/10'
                        : 'bg-slate-100 dark:bg-slate-800',
                    )}
                  >
                    <span className="material-symbols-outlined">
                      {option.icon}
                    </span>
                  </div>
                  <span className="text-xs font-medium">{option.name}</span>
                  {theme === option.id && (
                    <span className="material-symbols-outlined text-[14px] text-primary">
                      check_circle
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Language Setting */}
          <div className="space-y-3">
            <span className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-slate-400">
                translate
              </span>
              Ngôn ngữ
            </span>
            <div className="grid grid-cols-2 gap-2">
              {LANGUAGE_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setLanguage(option.id)}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-xl border-2 transition-all',
                    language === option.id
                      ? 'border-primary bg-primary/5'
                      : 'border-slate-200 dark:border-slate-700 hover:border-primary/50',
                  )}
                >
                  <span className="text-xl">{option.flag}</span>
                  <span
                    className={cn(
                      'text-sm font-medium',
                      language === option.id
                        ? 'text-primary'
                        : 'text-slate-900 dark:text-white',
                    )}
                  >
                    {option.name}
                  </span>
                  {language === option.id && (
                    <span className="material-symbols-outlined text-[14px] text-primary ml-auto">
                      check_circle
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Other Settings */}
          <div className="space-y-3">
            <span className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-slate-400">
                tune
              </span>
              Khác
            </span>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[20px] text-slate-400">
                    notifications
                  </span>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      Thông báo
                    </p>
                    <p className="text-xs text-slate-500">
                      Nhận nhắc nhở qua browser
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => Notification.requestPermission()}
                  className={cn(
                    'px-3 py-1.5 text-xs font-medium rounded-lg',
                    Notification.permission === 'granted'
                      ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : 'bg-primary/10 text-primary hover:bg-primary/20',
                  )}
                >
                  {Notification.permission === 'granted' ? '✓ Đã bật' : 'Bật'}
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[20px] text-slate-400">
                    keyboard
                  </span>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      Phím tắt
                    </p>
                    <p className="text-xs text-slate-500">
                      Ctrl+N, Ctrl+Z, Enter
                    </p>
                  </div>
                </div>
                <span className="text-xs text-slate-400 bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded">
                  Luôn bật
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-700 text-center">
          <p className="text-xs text-slate-400">
            TaskDash v1.0 • Cài đặt được lưu tự động
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
