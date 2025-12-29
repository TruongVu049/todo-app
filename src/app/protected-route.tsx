import { Navigate } from 'react-router'
import { useAuthStore } from '@/stores/auth'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = useAuthStore((state) => state.token)

  // Check if user has token
  if (!token) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
