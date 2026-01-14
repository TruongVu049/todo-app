import React from 'react'

type HeaderProps = {
  title?: string
  subtitle?: string
}

export const Header: React.FC<HeaderProps> = ({
  title = 'Todo Management',
  subtitle = 'Quản lý công việc hiệu quả và dễ dàng',
}) => {
  return (
    <header className="bg-white border-b-2 border-gray-100 shadow-md mb-0 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 transition-transform hover:scale-105">
            <img
              src="/logomeu.png"
              alt="MeU Solutions Logo"
              className="h-14 w-auto object-contain drop-shadow-sm"
            />
          </div>

          <div className="h-12 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent" />

          <div className="flex-1">
            <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {title}
            </h1>
            <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-full">
            <span className="text-xs text-gray-600">Powered by</span>
            <span className="text-xs font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              MeU Solutions
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
