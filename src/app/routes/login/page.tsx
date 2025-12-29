'use client'

import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useLogin, useAuth } from '@/hooks/use-auth'
import { Book, Rocket, CheckCircle, Loader2, AlertCircle } from 'lucide-react'
import logo from '@/assets/logo.png'

// Form validation schema
const loginSchema = z.object({
  username: z.string().min(1, 'Vui lòng nhập tên đăng nhập'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
})

type LoginFormData = z.infer<typeof loginSchema>

type FeatureType = 'create' | 'manage' | 'achieve' | 'logo' | null

export default function LoginPage() {
  const [selectedFeature, setSelectedFeature] = useState<FeatureType>(null)
  const { error: authError, clearError } = useAuth()
  const loginMutation = useLogin()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  // Clear errors when component mounts (after logout)
  useEffect(() => {
    clearError()
    loginMutation.reset()
  }, [])

  const onSubmit = (data: LoginFormData) => {
    clearError()
    loginMutation.reset()
    loginMutation.mutate(data)
  }

  // Fill test account
  const fillTestAccount = () => {
    setValue('username', 'emilys')
    setValue('password', 'emilyspass')
  }

  const features = {
    create: {
      title: 'Tạo Công Việc',
      description: 'Thêm các nhiệm vụ hàng ngày',
      details: 'Dễ dàng tạo công việc mới với interface đơn giản. Bạn có thể thêm tiêu đề và đặt trạng thái cho từng công việc. Giúp bạn không bao giờ quên những việc cần làm.',
      color: 'from-blue-600 to-blue-700',
    },
    manage: {
      title: 'Quản Lý Tiến Độ',
      description: 'Theo dõi công việc của bạn',
      details: 'Theo dõi trạng thái của mỗi công việc một cách trực quan. Đánh dấu hoàn thành, xem số lượng công việc đã làm và công việc còn lại.',
      color: 'from-green-600 to-green-700',
    },
    achieve: {
      title: 'Đạt Mục Tiêu',
      description: 'Hoàn thành những việc quan trọng',
      details: 'Khi bạn hoàn thành công việc, nó sẽ được đánh dấu là xong. Tích lũy những thành công nhỏ để đạt được những mục tiêu lớn!',
      color: 'from-purple-600 to-purple-700',
    },
    logo: {
      title: 'MeU Solutions',
      description: 'Giải pháp quản lý công việc toàn diện',
      details: 'MeU Solutions cung cấp công cụ mạnh mẽ để giúp bạn quản lý công việc một cách hiệu quả. Với giao diện thân thiện và tính năng đầy đủ.',
      color: 'from-orange-500 to-orange-600',
    },
  }

  const current = selectedFeature ? features[selectedFeature] : null
  const isLoading = loginMutation.isPending
  const apiError = loginMutation.error?.message || authError

  return (
    <div className="min-h-screen bg-white">
      {/* Keyframe animation for slide-in from left */}
      <style>
        {`
          @keyframes slideInFromLeft {
            0% {
              transform: translateX(-100%);
              opacity: 0;
            }
            100% {
              transform: translateX(0);
              opacity: 1;
            }
          }
          @keyframes slideInFromTop {
            0% {
              transform: translateY(-100%);
              opacity: 0;
            }
            100% {
              transform: translateY(0);
              opacity: 1;
            }
          }
          .slide-in-left {
            animation: slideInFromLeft 0.6s ease-out forwards;
          }
          .slide-in-top {
            animation: slideInFromTop 0.6s ease-out forwards;
          }
        `}
      </style>
      <div className="flex h-screen">
        {/* Left side - Branding & Info */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 flex-col items-center justify-center px-12 py-12 relative overflow-hidden slide-in-left">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
          </div>

          {/* Content */}
          <div className="relative z-10 text-center">
            <button
              onClick={() => setSelectedFeature('logo')}
              className={`inline-block mb-8 drop-shadow-lg transition-transform duration-300 hover:scale-110 focus:outline-none ${selectedFeature === 'logo' ? 'scale-110' : ''}`}
            >
              <img
                src={logo}
                alt="MeU Solutions"
                className="h-48 w-48 object-contain"
              />
            </button>

            <h1 className="text-5xl font-bold text-white mb-4">MEU TODO</h1>
            <p className="text-xl text-blue-100 mb-12 max-w-md mx-auto">
              Quản lý công việc một cách thông minh và hiệu quả
            </p>

            {/* Features */}
            <div className="space-y-6 mt-16">
              <button
                onClick={() => setSelectedFeature('create')}
                className={`flex items-center justify-center gap-4 w-full transition-all duration-300 transform hover:scale-105 ${selectedFeature === 'create' ? 'scale-105' : ''}`}
              >
                <div className="shrink-0">
                  <div className={`flex items-center justify-center h-16 w-16 rounded-full bg-white transition-all duration-300 ${selectedFeature === 'create' ? 'ring-4 ring-white ring-opacity-50' : ''}`}>
                    <Book className="h-8 w-8 text-blue-600" strokeWidth={2} />
                  </div>
                </div>
                <div className="text-left flex-1">
                  <p className="text-white font-semibold text-lg">Tạo công việc</p>
                  <p className="text-blue-100 text-sm">Thêm các nhiệm vụ hàng ngày</p>
                </div>
              </button>

              <button
                onClick={() => setSelectedFeature('manage')}
                className={`flex items-center justify-center gap-4 w-full transition-all duration-300 transform hover:scale-105 ${selectedFeature === 'manage' ? 'scale-105' : ''}`}
              >
                <div className="shrink-0">
                  <div className={`flex items-center justify-center h-16 w-16 rounded-full bg-white transition-all duration-300 ${selectedFeature === 'manage' ? 'ring-4 ring-white ring-opacity-50' : ''}`}>
                    <Rocket className="h-8 w-8 text-green-600" strokeWidth={2} />
                  </div>
                </div>
                <div className="text-left flex-1">
                  <p className="text-white font-semibold text-lg">Quản lý tiến độ</p>
                  <p className="text-blue-100 text-sm">Theo dõi công việc của bạn</p>
                </div>
              </button>

              <button
                onClick={() => setSelectedFeature('achieve')}
                className={`flex items-center justify-center gap-4 w-full transition-all duration-300 transform hover:scale-105 ${selectedFeature === 'achieve' ? 'scale-105' : ''}`}
              >
                <div className="shrink-0">
                  <div className={`flex items-center justify-center h-16 w-16 rounded-full bg-white transition-all duration-300 ${selectedFeature === 'achieve' ? 'ring-4 ring-white ring-opacity-50' : ''}`}>
                    <CheckCircle className="h-8 w-8 text-purple-600" strokeWidth={2} />
                  </div>
                </div>
                <div className="text-left flex-1">
                  <p className="text-white font-semibold text-lg">Đạt mục tiêu</p>
                  <p className="text-blue-100 text-sm">Hoàn thành những việc quan trọng</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-6 sm:px-8 bg-linear-to-br from-gray-50 to-gray-100 slide-in-top">
          <div className="w-full max-w-sm">
            {/* Mobile header */}
            <div className="lg:hidden text-center mb-6">
              <div className="flex justify-center mb-3">
                <img src={logo} alt="MeU Solutions" className="h-16 w-16 drop-shadow-lg" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">MEU TODO</h1>
              <p className="text-gray-600 text-sm">Quản lý công việc của bạn</p>
            </div>

            {/* Content - Dynamic */}
            <div className="transition-all duration-500">
              {!current ? (
                <>
                  <div className="hidden lg:block text-left mb-4">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">Chào mừng</h2>
                    <p className="text-gray-600 text-sm">
                      Đăng nhập để quản lý công việc của bạn
                    </p>
                  </div>

                  {/* Login Form */}
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Đăng Nhập</h3>

                    {/* Error Message */}
                    {apiError && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-red-800">Đăng nhập thất bại</p>
                          <p className="text-xs text-red-700">{apiError}</p>
                        </div>
                      </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                          Tên đăng nhập
                        </label>
                        <input
                          type="text"
                          id="username"
                          placeholder="Nhập tên đăng nhập"
                          autoComplete="username"
                          disabled={isLoading}
                          className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed ${errors.username ? 'border-red-500' : 'border-gray-300'
                            }`}
                          {...register('username')}
                        />
                        {errors.username && (
                          <p className="mt-1 text-xs text-red-600">{errors.username.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                          Mật khẩu
                        </label>
                        <input
                          type="password"
                          id="password"
                          placeholder="Nhập mật khẩu"
                          autoComplete="current-password"
                          disabled={isLoading}
                          className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed ${errors.password ? 'border-red-500' : 'border-gray-300'
                            }`}
                          {...register('password')}
                        />
                        {errors.password && (
                          <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold py-2.5 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 text-sm"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Đang đăng nhập...
                          </>
                        ) : (
                          'Đăng Nhập'
                        )}
                      </button>
                    </form>

                    {/* Test Account Info */}
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium text-blue-800">Tài khoản test:</p>
                        <button
                          type="button"
                          onClick={fillTestAccount}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-1.5 px-3 rounded-md transition-all hover:scale-105 shadow-sm flex items-center gap-1"
                        >
                          <span>✨</span>
                          Điền tự động
                        </button>
                      </div>
                      <div className="flex gap-4 text-xs text-blue-700">
                        <span>Username: <code className="bg-blue-100 px-1 rounded">emilys</code></span>
                        <span>Password: <code className="bg-blue-100 px-1 rounded">emilyspass</code></span>
                      </div>
                    </div>

                    {/* Register Link */}
                    <div className="mt-4 text-center">
                      <p className="text-gray-600 text-sm">
                        Chưa có tài khoản?{' '}
                        <Link to="/register" className="text-blue-600 hover:text-blue-800 font-semibold">
                          Đăng ký ngay
                        </Link>
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="animate-fadeIn">
                  <div className={`bg-linear-to-r ${current.color} rounded-xl p-6 text-white mb-6`}>
                    <h3 className="text-2xl font-bold mb-2">{current.title}</h3>
                    <p className="text-sm opacity-90 mb-4">{current.description}</p>
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-sm leading-relaxed text-gray-900">{current.details}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedFeature(null)}
                    className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 font-semibold py-2 transition-colors text-sm"
                  >
                    ← Quay lại đăng nhập
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="text-center mt-4">
              <p className="text-gray-500 text-xs">
                Powered by <span className="font-semibold text-blue-600">MeU Solutions</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
