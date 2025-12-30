import { useMemo } from 'react'
import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'

import { paths } from '@/config/paths'

export const createAppRouter = () =>
  createBrowserRouter([
    {
      path: paths.login.path,
      lazy: async () => {
        const { default: LoginPage } = await import('@/pages/LoginPage')
        return { element: <LoginPage /> }
      },
    },
    {
      lazy: async () => {
        const { ProtectedRoute } = await import('@/components/layouts/ProtectedRoute')
        return { element: <ProtectedRoute /> }
      },
      children: [
        {
          lazy: async () => {
            const { AppLayout } = await import('@/components/layouts/AppLayout')
            return { element: <AppLayout /> }
          },
          children: [
            {
              path: paths.home.path,
              lazy: async () => {
                const { default: TodosPage } = await import('@/pages/TodosPage')
                return { element: <TodosPage /> }
              },
            },
          ],
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
