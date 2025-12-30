import * as React from 'react'
import { useNavigate } from 'react-router'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { paths } from '@/config/paths'
import { useAuthStore } from '@/features/auth/store'

interface ProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProfileModal({ open, onOpenChange }: ProfileModalProps) {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [name, setName] = React.useState(user?.firstName || 'Người dùng')
  const [email, setEmail] = React.useState(user?.email || 'user@example.com')

  const handleSave = () => {
    onOpenChange(false)
  }

  const handleLogout = () => {
    logout()
    onOpenChange(false)
    navigate(paths.login.getHref())
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <span className="material-symbols-outlined text-primary">
              person
            </span>
            Hồ sơ cá nhân
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <div
              className="size-20 rounded-full bg-cover bg-center ring-4 ring-primary/20"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD6s1bsO331SuWxFMxVT2a1rZ590J6IZPvk2fEDE4KDsI4G42S_FcGJFBgpPl0TS9oG1YHhEK57VnZVBc_Mki5p-RR3K_uVKQNa78xl_Hr4bFmJ7ixuzK_l0jbrO88MciSqOSExEnnL-omW_WqbbCbUuB9W7nkgZ8gu6Z_p_eektopNcFOwzc075CCtBFoxP8FBU6xbhRvr4cjgkSdGUbRYpoCupBjU_XqQqlVU5ISsQZIxCKX1XkL2g00eyEVhw3L7SkyCG1xEuSg")',
              }}
            />
            <button className="text-sm text-primary hover:text-primary/80 font-medium">
              Đổi ảnh đại diện
            </button>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <label
              htmlFor="profile-name"
              className="text-sm font-medium text-slate-900 dark:text-white"
            >
              Tên hiển thị
            </label>
            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label
              htmlFor="profile-email"
              className="text-sm font-medium text-slate-900 dark:text-white"
            >
              Email
            </label>
            <input
              id="profile-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
              <p className="text-2xl font-bold text-primary">156</p>
              <p className="text-xs text-slate-500">Đã hoàn thành</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                12
              </p>
              <p className="text-xs text-slate-500">Đang làm</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
              <p className="text-2xl font-bold text-emerald-500">85%</p>
              <p className="text-xs text-slate-500">Tỷ lệ</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
          <Button
            variant="outline"
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={handleLogout}
          >
            Đăng xuất
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button onClick={handleSave}>Lưu</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
