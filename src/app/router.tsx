import { useMemo } from 'react'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'

import ProtectedRoute from '@/components/protected-route'

import { AuthLayout } from './layouts/auth-layout'
import { MainLayout } from './layouts/main-layout'

export const createAppRouter = () =>
  createBrowserRouter([
    {
      path: '/',
      element: <Navigate to="/todos" replace />,
    },

    {
      path: '/login',
      element: <AuthLayout />,
      children: [
        {
          index: true,
          lazy: async () => {
            const { default: Login } = await import('./routes/login/page')
            return { element: <Login /> }
          },
        },
      ],
    },

    {
      path: '/todos',
      element: (
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          lazy: async () => {
            const { default: Todos } = await import('./routes/todos/page')
            return { element: <Todos /> }
          },
        },
      ],
    },

    {
      path: '/new-todo',
      element: (
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          lazy: async () => {
            const { default: NewTodo } = await import('../new-todo/page')
            return { element: <NewTodo /> }
          },
        },
      ],
    },

    {
      path: '*',
      element: <Navigate to="/todos" replace />,
    },
  ])

export const AppRouter = () => {
  const router = useMemo(() => createAppRouter(), [])
  return <RouterProvider router={router} />
}
