import { useState } from 'react'
import { Navigate } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { CircleAlert, Lock, User, LogIn } from 'lucide-react'

export default function LoginPage() {
    const { loginMutation, isAuthenticated } = useAuth()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    // Redirect if already logged in
    if (isAuthenticated) {
        return <Navigate to="/" replace />
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!username.trim() || !password.trim()) return
        loginMutation.mutate({ username, password })
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo & Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-4">
                        <LogIn className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
                    <p className="text-slate-400 mt-2">Sign in to access your todos</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Error Message */}
                        {loginMutation.isError && (
                            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-100">
                                <CircleAlert className="w-5 h-5 text-red-500 flex-shrink-0" />
                                <p className="text-sm text-red-600">
                                    {loginMutation.error?.message || 'Invalid username or password'}
                                </p>
                            </div>
                        )}

                        {/* Username Field */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Username
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="w-5 h-5 text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter your username"
                                    className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    disabled={loginMutation.isPending}
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="w-5 h-5 text-slate-400" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    disabled={loginMutation.isPending}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full h-12 rounded-xl text-base"
                            disabled={!username.trim() || !password.trim() || loginMutation.isPending}
                            isLoading={loginMutation.isPending}
                        >
                            {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </form>

                    {/* Demo Credentials */}
                    <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <p className="text-xs font-medium text-slate-500 mb-2">Demo Credentials:</p>
                        <div className="space-y-1 text-sm text-slate-600">
                            <p><span className="font-medium">Username:</span> emilys</p>
                            <p><span className="font-medium">Password:</span> emilyspass</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-slate-500 text-sm mt-6">
                    Todo App © 2025
                </p>
            </div>
        </div>
    )
}
