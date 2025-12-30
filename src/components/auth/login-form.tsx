import { motion } from 'framer-motion'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DEMO_ACCOUNT, MESSAGES } from '@/constants'
import { useLogin } from '@/hooks/use-auth'

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
    setUsername(DEMO_ACCOUNT.username)
    setPassword(DEMO_ACCOUNT.password)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
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
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
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
      </motion.div>

      {login.isError && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4"
        >
          <p className="text-sm text-red-800">
            {login.error instanceof Error
              ? login.error.message
              : MESSAGES.errors.loginFailed}
          </p>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Button
          type="submit"
          className="w-full h-11 text-white font-medium shadow-md hover:shadow-lg transition-all cursor-pointer bg-brand-primary hover:bg-brand-primary-hover"
          disabled={login.isPending}
        >
          {login.isPending ? 'Logging in...' : 'Đăng nhập'}
        </Button>
      </motion.div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3"
      >
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Tên đăng nhập:</span>
            <code className="font-mono text-sm bg-white px-2 py-1 rounded border border-gray-200">
              {DEMO_ACCOUNT.username}
            </code>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Mật khẩu:</span>
            <code className="font-mono text-sm bg-white px-2 py-1 rounded border border-gray-200">
              {DEMO_ACCOUNT.password}
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
      </motion.div>
    </form>
  )
}
