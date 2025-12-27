import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { loginApi } from '../../../api/auth.api'

const Login = () => {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const loginMutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      // lưu token
      localStorage.setItem('token', data.token)

      // chuyển trang
      navigate('/todos')
    },
    onError: () => {
      alert('Sai tài khoản hoặc mật khẩu')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    loginMutation.mutate({
      username,
      password,
    })
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="w-80 rounded border p-6 shadow">
        <h1 className="mb-4 text-xl font-bold">Login</h1>

        <input
          className="mb-3 w-full border p-2"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="mb-3 w-full border p-2"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-blue-500 p-2 text-white"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  )
}

export default Login
