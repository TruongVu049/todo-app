'use client'

import { useEffect } from 'react'
import { Link } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRegister } from '@/hooks/use-auth'
import { Loader2, AlertCircle, CheckCircle, UserPlus, Shield, Sparkles } from 'lucide-react'
import logo from '@/assets/logo.png'

// Form validation schema
const registerSchema = z.object({
  username: z.string().min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  confirmPassword: z.string(),
  firstName: z.string().min(1, 'Vui lòng nhập họ'),
  lastName: z.string().min(1, 'Vui lòng nhập tên'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword'],
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const registerMutation = useRegister()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
    },
  })

  useEffect(() => {
    registerMutation.reset()
  }, [])

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.reset()
    registerMutation.mutate({
      username: data.username,
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
    })
  }

  const isLoading = registerMutation.isPending
  const isSuccess = registerMutation.isSuccess
  const apiError = registerMutation.error?.message

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
        {/* Left side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-purple-600 via-purple-500 to-blue-600 flex-col items-center justify-center px-12 py-12 relative overflow-hidden slide-in-left">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
          </div>

          {/* Content */}
          <div className="relative z-10 text-center">
            <Link to="/login" className="inline-block mb-8">
              <img
                src={logo}
                alt="MeU Solutions"
                className="h-48 w-48 object-contain drop-shadow-lg transition-transform hover:scale-110"
              />
            </Link>

            <h1 className="text-4xl font-bold text-white mb-4">Tham Gia MEU TODO</h1>
            <p className="text-lg text-purple-100 mb-12 max-w-md mx-auto">
              Đăng ký để bắt đầu quản lý công việc hiệu quả
            </p>

            {/* Features */}
            <div className="space-y-5 mt-12">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-white shrink-0">
                  <UserPlus className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-left">
                  <p className="text-white font-semibold">Đăng ký miễn phí</p>
                  <p className="text-purple-100 text-sm">Tạo tài khoản chỉ trong vài giây</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-white shrink-0">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="text-white font-semibold">Bảo mật cao</p>
                  <p className="text-purple-100 text-sm">Dữ liệu được mã hóa an toàn</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-white shrink-0">
                  <Sparkles className="h-6 w-6 text-pink-600" />
                </div>
                <div className="text-left">
                  <p className="text-white font-semibold">Trải nghiệm tuyệt vời</p>
                  <p className="text-purple-100 text-sm">Giao diện đẹp, dễ sử dụng</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Register Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-6 sm:px-8 bg-linear-to-br from-gray-50 to-gray-100 overflow-y-auto slide-in-top">
          <div className="w-full max-w-sm">
            {/* Mobile header */}
            <div className="lg:hidden text-center mb-4">
              <Link to="/login" className="inline-block mb-2">
                <img src={logo} alt="MeU Solutions" className="h-14 w-14 mx-auto drop-shadow-lg" />
              </Link>
              <h1 className="text-xl font-bold text-gray-900">Đăng Ký Tài Khoản</h1>
            </div>

            {/* Desktop header */}
            <div className="hidden lg:block text-left mb-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Đăng Ký</h2>
              <p className="text-gray-600 text-sm">Tạo tài khoản mới để sử dụng MEU TODO</p>
            </div>

            {/* Register Form */}
            <div className="bg-white rounded-xl shadow-lg p-5">
              {/* Success Message */}
              {isSuccess && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-green-800">Đăng ký thành công!</p>
                    <p className="text-xs text-green-700">Đang chuyển hướng...</p>
                  </div>
                </div>
              )}

              {/* API Notice */}
              <div className="mb-4 p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs font-medium text-amber-800">⚠️ Demo API - Dùng tài khoản test: <code className="bg-amber-100 px-1 rounded">emilys</code> / <code className="bg-amber-100 px-1 rounded">emilyspass</code></p>
              </div>

              {/* Error Message */}
              {apiError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-red-700">{apiError}</p>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                {/* Name Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="firstName" className="block text-xs font-medium text-gray-700 mb-1">Họ</label>
                    <input
                      type="text"
                      id="firstName"
                      placeholder="Nguyễn"
                      disabled={isLoading}
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:bg-gray-100 ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                      {...register('firstName')}
                    />
                    {errors.firstName && <p className="mt-0.5 text-xs text-red-600">{errors.firstName.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-xs font-medium text-gray-700 mb-1">Tên</label>
                    <input
                      type="text"
                      id="lastName"
                      placeholder="Văn A"
                      disabled={isLoading}
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:bg-gray-100 ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                      {...register('lastName')}
                    />
                    {errors.lastName && <p className="mt-0.5 text-xs text-red-600">{errors.lastName.message}</p>}
                  </div>
                </div>

                {/* Username */}
                <div>
                  <label htmlFor="username" className="block text-xs font-medium text-gray-700 mb-1">Tên đăng nhập</label>
                  <input
                    type="text"
                    id="username"
                    placeholder="nguyenvana"
                    autoComplete="username"
                    disabled={isLoading}
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:bg-gray-100 ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
                    {...register('username')}
                  />
                  {errors.username && <p className="mt-0.5 text-xs text-red-600">{errors.username.message}</p>}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="email@example.com"
                    autoComplete="email"
                    disabled={isLoading}
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:bg-gray-100 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    {...register('email')}
                  />
                  {errors.email && <p className="mt-0.5 text-xs text-red-600">{errors.email.message}</p>}
                </div>

                {/* Password Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1">Mật khẩu</label>
                    <input
                      type="password"
                      id="password"
                      placeholder="Ít nhất 6 ký tự"
                      autoComplete="new-password"
                      disabled={isLoading}
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:bg-gray-100 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                      {...register('password')}
                    />
                    {errors.password && <p className="mt-0.5 text-xs text-red-600">{errors.password.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-700 mb-1">Xác nhận</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      placeholder="Nhập lại"
                      autoComplete="new-password"
                      disabled={isLoading}
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:bg-gray-100 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                      {...register('confirmPassword')}
                    />
                    {errors.confirmPassword && <p className="mt-0.5 text-xs text-red-600">{errors.confirmPassword.message}</p>}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || isSuccess}
                  className="w-full bg-linear-to-r from-purple-600 to-blue-600 text-white font-semibold py-2.5 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-[1.02] shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 text-sm mt-4"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Đang đăng ký...
                    </>
                  ) : (
                    'Đăng Ký'
                  )}
                </button>
              </form>

              {/* Login Link */}
              <div className="mt-4 text-center">
                <p className="text-gray-600 text-sm">
                  Đã có tài khoản?{' '}
                  <Link to="/login" className="text-purple-600 hover:text-purple-800 font-semibold">
                    Đăng nhập
                  </Link>
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-4">
              <p className="text-gray-500 text-xs">
                Powered by <span className="font-semibold text-purple-600">MeU Solutions</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
