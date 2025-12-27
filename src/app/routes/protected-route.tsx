import { Navigate } from 'react-router-dom'

import { paths } from '@/config/paths'

type ProtectedRouteProps = {
  children: JSX.Element
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = localStorage.getItem('token')

  if (!token) {
    return <Navigate to={paths.login.path} replace />
  }

  return children
}
