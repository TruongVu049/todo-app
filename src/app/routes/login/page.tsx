import { LoginForm } from '@/components/auth'
import { Head } from '@/components/seo/head'

const LoginPage = () => {
  return (
    <>
      <Head title="Login" description="Login to access your todos" />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Đăng nhập tài khoản
            </h1>
            <p className="text-gray-500 text-sm">
              Quản lý công việc hàng ngày của bạn một cách đơn giản và hiệu quả
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
            <LoginForm />
          </div>
        </div>
      </div>
    </>
  )
}

export default LoginPage
