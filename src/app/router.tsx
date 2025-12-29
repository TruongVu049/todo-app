import { useMemo } from 'react'
import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'

import { ProtectedRoute } from '@/components/auth'
import { paths } from '@/config/paths'

export const createAppRouter = () =>
  createBrowserRouter([
    {
      path: paths.home.path,
      lazy: async () => {
        const { default: Home } = await import('./routes/home/page')
        return { element: <Home /> }
      },
    },
    {
      path: paths.login.path,
      lazy: async () => {
        const { default: LoginPage } = await import('./routes/login/page')
        return { element: <LoginPage /> }
      },
    },
    {
      element: <ProtectedRoute />,
      children: [
        {
          path: paths.todos.path,
          lazy: async () => {
            const { default: TodosPage } = await import('./routes/todos/page')
            return { element: <TodosPage /> }
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
