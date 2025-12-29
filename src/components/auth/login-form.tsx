import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { colors } from '@/config/colors'
import { useLogin } from '@/hooks/use-auth'

const DEMO_CREDENTIALS = {
  username: 'addisonw',
  password: 'addisonwpass',
}

export const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const login = useLogin()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login.mutate({
      username: username.trim(),
      password: password.trim(),
    })
  }

  const fillDemoCredentials = () => {
    setUsername(DEMO_CREDENTIALS.username)
    setPassword(DEMO_CREDENTIALS.password)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Tên đăng nhập
        </label>
        <Input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Nhập tên đăng nhập"
          required
          disabled={login.isPending}
          className="h-11"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Mật khẩu
        </label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Nhập mật khẩu"
          required
          disabled={login.isPending}
          className="h-11"
        />
      </div>

      {login.isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">
            {login.error instanceof Error
              ? login.error.message
              : 'Login failed. Please try again.'}
          </p>
        </div>
      )}

      <Button
        type="submit"
        className="w-full h-11 text-white font-medium shadow-md hover:shadow-lg transition-all cursor-pointer"
        disabled={login.isPending}
        style={{ backgroundColor: colors.brand.primary }}
        onMouseEnter={(e) =>
          !e.currentTarget.disabled &&
          (e.currentTarget.style.backgroundColor = colors.brand.primaryHover)
        }
        onMouseLeave={(e) =>
          !e.currentTarget.disabled &&
          (e.currentTarget.style.backgroundColor = colors.brand.primary)
        }
      >
        {login.isPending ? 'Logging in...' : 'Đăng nhập'}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Tên đăng nhập:</span>
            <code className="font-mono text-sm bg-white px-2 py-1 rounded border border-gray-200">
              {DEMO_CREDENTIALS.username}
            </code>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Mật khẩu:</span>
            <code className="font-mono text-sm bg-white px-2 py-1 rounded border border-gray-200">
              {DEMO_CREDENTIALS.password}
            </code>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={fillDemoCredentials}
          disabled={login.isPending}
          className="w-full"
        >
          Sử dụng thông tin này để đăng nhập
        </Button>
      </div>
    </form>
  )
}
