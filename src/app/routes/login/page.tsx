import { useState } from 'react'

import logo from '@/assets/logo.png'
import { env } from '@/config/env'
import { useAuth } from '@/hooks/use-auth'
import type { LoginRequest } from '@/types/auth'

const Login = () => {
  const { loginMutation, login } = useAuth()
  const [form, setForm] = useState<LoginRequest>({ username: '', password: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login(form)
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center p-6"
      style={{
        backgroundImage: `url(${logo})`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="relative rounded-2xl bg-white p-8 shadow-lg ring-1 ring-slate-100"
        >
          <h1 className="mb-1 text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="mb-6 text-sm text-slate-500">
            Sign in to access your todos
          </p>

          {env.ENABLE_API_MOCKING && (
            <div className="mb-4 rounded-md border border-blue-100 bg-blue-50 p-3 text-sm text-blue-700">
              Dev mock enabled — use{' '}
              <span className="font-semibold">kminchelle</span>
              <span className="mx-2 text-slate-400">/</span>
              <span className="font-semibold">0lelplR</span>
            </div>
          )}

          {loginMutation.isError && (
            <div
              role="alert"
              className="mb-4 flex items-start gap-3 rounded-md border border-red-100 bg-red-50 p-3 text-sm text-red-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 flex-none"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11V5a1 1 0 10-2 0v2a1 1 0 002 0zm0 6a1 1 0 10-2 0 1 1 0 002 0z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                {(loginMutation.error as Error)?.message || 'Login failed'}
              </div>
            </div>
          )}

          <label className="mb-2 block text-sm font-medium text-slate-600">
            Username
            <input
              className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="kminchelle"
              value={form.username}
              onChange={(e) =>
                setForm((s) => ({ ...s, username: e.target.value }))
              }
              required
              aria-label="Username"
            />
          </label>

          <label className="mb-4 block text-sm font-medium text-slate-600">
            Password
            <input
              className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) =>
                setForm((s) => ({ ...s, password: e.target.value }))
              }
              required
              aria-label="Password"
            />
          </label>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-3 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
            disabled={loginMutation.isPending}
            aria-busy={loginMutation.isPending}
          >
            {loginMutation.isPending ? (
              <svg
                className="h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            ) : null}

            {loginMutation.isPending ? 'Logging in...' : 'Login'}
          </button>

          <div className="mt-4 text-center text-xs text-slate-400">
            By signing in you agree to the app terms.
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
