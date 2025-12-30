import { Outlet } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { LogOut, User } from 'lucide-react'
import { useNavigate } from 'react-router'

export function AppLayout() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-slate-900">Todo App</h1>

                    {user && (
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                {user.image ? (
                                    <img
                                        src={user.image}
                                        alt={user.firstName}
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                        <User className="w-4 h-4 text-primary" />
                                    </div>
                                )}
                                <span className="text-sm font-medium text-slate-700 hidden sm:block">
                                    {user.firstName} {user.lastName}
                                </span>
                            </div>

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleLogout}
                                className="text-slate-500 hover:text-red-600"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </Button>
                        </div>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main>
                <Outlet />
            </main>
        </div>
    )
}
