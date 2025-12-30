import { Navigate, Outlet } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { Spinner } from '@/components/ui/spinner'

export function ProtectedRoute() {
    const { isAuthenticated, isLoading } = useAuth()

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return <Outlet />
}
