import { motion } from 'framer-motion'

import { LoginForm } from '@/components/auth'
import { Head } from '@/components/seo/head'

const LoginPage = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.42, 0, 0.58, 1] as [number, number, number, number],
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: 0.2,
        ease: [0.42, 0, 0.58, 1] as [number, number, number, number],
      },
    },
  }

  return (
    <>
      <Head title="Login" description="Login to access your todos" />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl font-bold text-gray-900 mb-2"
            >
              Đăng nhập tài khoản
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-gray-500 text-sm"
            >
              Quản lý công việc hàng ngày của bạn một cách đơn giản và hiệu quả
            </motion.p>
          </div>
          <motion.div
            variants={cardVariants}
            className="bg-white p-8 rounded-xl shadow-md border border-gray-200"
          >
            <LoginForm />
          </motion.div>
        </motion.div>
      </div>
    </>
  )
}

export default LoginPage
