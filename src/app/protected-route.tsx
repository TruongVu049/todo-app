import { Navigate } from 'react-router'
import { useAuthStore } from '@/stores/auth'

interface ProtectedRouteProps {
  element: React.ReactNode
}

export function ProtectedRoute({ element }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated())

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return element
}
