import { useMemo } from 'react'
import { createBrowserRouter, Navigate } from 'react-router'
import { RouterProvider } from 'react-router/dom'

import { ProtectedRoute } from './protected-route'
import { AuthLayout, MainLayout } from '@/components/layouts'

export const createAppRouter = () =>
  createBrowserRouter([
    // Auth routes (public)
    {
      element: <AuthLayout />,
      children: [
        {
          path: '/login',
          lazy: async () => {
            const { default: Login } = await import('./routes/login/page')
            return { element: <Login /> }
          },
        },
        {
          path: '/register',
          lazy: async () => {
            const { default: Register } = await import('./routes/register/page')
            return { element: <Register /> }
          },
        },
      ],
    },
    // Protected routes
    {
      element: (
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: '/',
          lazy: async () => {
            const { default: Home } = await import('./routes/home/page')
            return { element: <Home /> }
          },
        },
        {
          path: '/todo-challenge',
          lazy: async () => {
            const { default: TodoChallenge } = await import('./routes/todo-challenge/page')
            return { element: <TodoChallenge /> }
          },
        },
      ],
    },
    // Redirect and 404
    {
      path: '/home',
      element: <Navigate to="/" replace />,
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
