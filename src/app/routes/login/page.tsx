'use client'

import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuthStore } from '@/stores/auth'
import { Plus, CheckSquare, Zap, Book, Rocket, CheckCircle } from 'lucide-react'
import logo from '@/assets/logo.png'

type FeatureType = 'create' | 'manage' | 'achieve' | 'logo' | null

export default function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [selectedFeature, setSelectedFeature] = useState<FeatureType>(null)

  const handleQuickLogin = () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      gender: 'Male',
      image: 'https://via.placeholder.com/150',
    }

    const mockToken = 'mock-token-' + Math.random().toString(36).substr(2, 9)
    setAuth(mockUser, mockToken, 'mock-refresh-token')
    navigate('/')
  }

  const features = {
    create: {
      title: 'Tạo Công Việc',
      description: 'Thêm các nhiệm vụ hàng ngày',
      details: 'Dễ dàng tạo công việc mới với interface đơn giản. Bạn có thể thêm tiêu đề, mô tả chi tiết và đặt mức độ ưu tiên cho từng công việc. Giúp bạn không bao giờ quên những việc cần làm.',
      color: 'from-blue-600 to-blue-700',
    },
    manage: {
      title: 'Quản Lý Tiến Độ',
      description: 'Theo dõi công việc của bạn',
      details: 'Theo dõi trạng thái của mỗi công việc một cách trực quan. Đánh dấu hoàn thành, xem số lượng công việc đã làm và công việc còn lại. Giúp bạn biết mình đang ở đâu trong quá trình hoàn thành mục tiêu.',
      color: 'from-green-600 to-green-700',
    },
    achieve: {
      title: 'Đạt Mục Tiêu',
      description: 'Hoàn thành những việc quan trọng',
      details: 'Khi bạn hoàn thành công việc, nó sẽ được đánh dấu là xong. Tích lũy những thành công nhỏ để đạt được những mục tiêu lớn. Hãy tự hào với những gì bạn đã làm được!',
      color: 'from-purple-600 to-purple-700',
    },
    logo: {
      title: 'MeU Solutions',
      description: 'Giải pháp quản lý công việc toàn diện',
      details: 'MeU Solutions cung cấp công cụ mạnh mẽ để giúp bạn quản lý công việc một cách hiệu quả. Với giao diện thân thiện và tính năng đầy đủ, chúng tôi cam kết giúp bạn trở nên năng suất hơn mỗi ngày.',
      color: 'from-orange-500 to-orange-600',
    },
  }

  const current = selectedFeature ? features[selectedFeature] : null

  return (
    <div className="min-h-screen bg-white">
      <div className="flex h-screen">
        {/* Left side - Branding & Info */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 flex-col items-center justify-center px-12 py-12 relative overflow-hidden">
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
              className={`inline-block mb-8 drop-shadow-lg transition-transform duration-300 hover:scale-110 ${selectedFeature === 'logo' ? 'scale-110' : ''}`}
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
              {/* Feature 1 */}
              <button
                onClick={() => setSelectedFeature('create')}
                className={`flex items-center justify-center gap-4 w-full transition-all duration-300 transform hover:scale-105 ${selectedFeature === 'create' ? 'scale-105' : ''}`}
              >
                <div className="flex-shrink-0">
                  <div className={`flex items-center justify-center h-16 w-16 rounded-full bg-white transition-all duration-300 ${selectedFeature === 'create' ? 'ring-4 ring-white ring-opacity-50' : ''}`}>
                    <Book className="h-8 w-8 text-blue-600" strokeWidth={2} />
                  </div>
                </div>
                <div className="text-left flex-1">
                  <p className="text-white font-semibold text-lg">Tạo công việc</p>
                  <p className="text-blue-100 text-sm">Thêm các nhiệm vụ hàng ngày</p>
                </div>
              </button>

              {/* Feature 2 */}
              <button
                onClick={() => setSelectedFeature('manage')}
                className={`flex items-center justify-center gap-4 w-full transition-all duration-300 transform hover:scale-105 ${selectedFeature === 'manage' ? 'scale-105' : ''}`}
              >
                <div className="flex-shrink-0">
                  <div className={`flex items-center justify-center h-16 w-16 rounded-full bg-white transition-all duration-300 ${selectedFeature === 'manage' ? 'ring-4 ring-white ring-opacity-50' : ''}`}>
                    <Rocket className="h-8 w-8 text-green-600" strokeWidth={2} />
                  </div>
                </div>
                <div className="text-left flex-1">
                  <p className="text-white font-semibold text-lg">Quản lý tiến độ</p>
                  <p className="text-blue-100 text-sm">Theo dõi công việc của bạn</p>
                </div>
              </button>

              {/* Feature 3 */}
              <button
                onClick={() => setSelectedFeature('achieve')}
                className={`flex items-center justify-center gap-4 w-full transition-all duration-300 transform hover:scale-105 ${selectedFeature === 'achieve' ? 'scale-105' : ''}`}
              >
                <div className="flex-shrink-0">
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

        {/* Right side - Login & Details */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 sm:px-12 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="w-full max-w-md">
            {/* Mobile header */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex justify-center mb-4">
                <img src={logo} alt="MeU Solutions" className="h-20 w-20 drop-shadow-lg" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">MEU TODO</h1>
              <p className="text-gray-600">Quản lý công việc của bạn</p>
              <p className="text-sm text-orange-600 font-semibold mt-2">MeU Solutions</p>
            </div>

            {/* Content - Dynamic */}
            <div className="min-h-96 transition-all duration-500">
              {!current ? (
                <>
                  <div className="hidden lg:block text-left mb-8">
                    <h2 className="text-4xl font-bold text-gray-900 mb-2">Chào mừng</h2>
                    <p className="text-gray-600 text-lg">
                      Bắt đầu quản lý công việc của bạn ngay hôm nay
                    </p>
                  </div>

                  {/* Login Form */}
                  <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Đăng Nhập</h3>
                    
                    <form className="space-y-5">
                      <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                          Tên đăng nhập
                        </label>
                        <input
                          type="text"
                          id="username"
                          placeholder="Nhập tên đăng nhập"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          defaultValue=""
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                          Mật khẩu
                        </label>
                        <input
                          type="password"
                          id="password"
                          placeholder="Nhập mật khẩu"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          defaultValue=""
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="flex items-center">
                          <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                          <span className="ml-2 text-sm text-gray-600">Ghi nhớ đăng nhập</span>
                        </label>
                        <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                          Quên mật khẩu?
                        </a>
                      </div>

                      <button
                        type="button"
                        onClick={handleQuickLogin}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
                      >
                        Đăng Nhập
                      </button>
                    </form>

                    <div className="mt-6 text-center">
                      <p className="text-sm text-gray-600">
                        Chưa có tài khoản?{' '}
                        <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold">
                          Đăng ký ngay
                        </a>
                      </p>
                    </div>
                  </div>

                  {/* Features on mobile */}
                  <div className="lg:hidden bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8">
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Plus className="h-5 w-5 text-blue-600 mr-3" />
                        <span className="text-sm text-gray-700"><strong>Tạo</strong> công việc</span>
                      </div>
                      <div className="flex items-center">
                        <CheckSquare className="h-5 w-5 text-green-600 mr-3" />
                        <span className="text-sm text-gray-700"><strong>Quản lý</strong> tiến độ</span>
                      </div>
                      <div className="flex items-center">
                        <Zap className="h-5 w-5 text-purple-600 mr-3" />
                        <span className="text-sm text-gray-700"><strong>Đạt</strong> thành công</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="animate-fadeIn">
                  <div className={`bg-gradient-to-r ${current.color} rounded-2xl p-8 text-white mb-8`}>
                    <h3 className="text-3xl font-bold mb-3">{current.title}</h3>
                    <p className="text-lg opacity-90 mb-6">{current.description}</p>
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-base leading-relaxed text-gray-900">{current.details}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedFeature(null)}
                    className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 font-semibold py-2 transition-colors"
                  >
                    ← Quay lại
                  </button>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="text-center mt-8">
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
