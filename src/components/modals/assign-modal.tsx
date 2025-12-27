import * as React from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/utils/cn'

interface AssignModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAssign?: (userId: string) => void
}

const TEAM_MEMBERS = [
  { id: '1', name: 'Bạn', email: 'you@example.com', avatar: '👤', isYou: true },
  { id: '2', name: 'Minh Tuấn', email: 'tuan@example.com', avatar: '👨‍💻' },
  { id: '3', name: 'Hồng Nhung', email: 'nhung@example.com', avatar: '👩‍💼' },
  { id: '4', name: 'Đức Anh', email: 'anh@example.com', avatar: '🧑‍🔬' },
  { id: '5', name: 'Thảo Vy', email: 'vy@example.com', avatar: '👩‍🎨' },
]

export function AssignModal({
  open,
  onOpenChange,
  onAssign,
}: AssignModalProps) {
  const [selectedUser, setSelectedUser] = React.useState<string | null>(null)
  const [searchQuery, setSearchQuery] = React.useState('')

  const filteredMembers = TEAM_MEMBERS.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAssign = () => {
    if (selectedUser) {
      onAssign?.(selectedUser)
      onOpenChange(false)
      setSelectedUser(null)
      setSearchQuery('')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <span className="material-symbols-outlined text-primary">
              person_add
            </span>
            Giao việc cho
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Search */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[20px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm thành viên..."
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-10 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
            />
          </div>

          {/* Member List */}
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {filteredMembers.map((member) => (
              <button
                key={member.id}
                onClick={() => setSelectedUser(member.id)}
                className={cn(
                  'w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left',
                  selectedUser === member.id
                    ? 'bg-primary/10 border border-primary/30'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent',
                )}
              >
                <span className="text-2xl">{member.avatar}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-2">
                    {member.name}
                    {member.isYou && (
                      <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                        Bạn
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {member.email}
                  </p>
                </div>
                {selectedUser === member.id && (
                  <span className="material-symbols-outlined text-primary">
                    check_circle
                  </span>
                )}
              </button>
            ))}
          </div>

          {filteredMembers.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <span className="material-symbols-outlined text-3xl mb-2 block">
                person_search
              </span>
              <p className="text-sm">Không tìm thấy thành viên</p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleAssign} disabled={!selectedUser}>
            Giao việc
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
