import { useMemo } from 'react'
import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'

import { ProtectedRoute } from '@/components/layout/protected-route'
import { paths } from '@/config/paths'

export const createAppRouter = () =>
  createBrowserRouter([
    // Public routes
    {
      path: paths.login.path,
      lazy: async () => {
        const { default: Login } = await import('./routes/auth/login')
        return { element: <Login /> }
      },
    },
    {
      path: paths.register.path,
      lazy: async () => {
        const { default: Register } = await import('./routes/auth/register')
        return { element: <Register /> }
      },
    },
    // Protected routes
    {
      element: <ProtectedRoute />,
      children: [
        {
          path: paths.home.path,
          lazy: async () => {
            const { default: Home } = await import('./routes/home/page')
            return { element: <Home /> }
          },
        },
      ],
    },
    {
      path: '*',
      lazy: async () => {
        const { default: NotFound } = await import('./routes/not-found')
        return { element: <NotFound /> }
      },
    },
  ])

export const AppRouter = () => {
  const router = useMemo(() => createAppRouter(), [])

  return <RouterProvider router={router} />
}
