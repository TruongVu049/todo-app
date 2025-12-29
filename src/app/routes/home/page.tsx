import { motion } from 'framer-motion'
import { CheckCircle2, ListTodo, Clock } from 'lucide-react'
import { useNavigate } from 'react-router'

import logo from '@/assets/logo.png'
import { Head } from '@/components/seo'
import { Button } from '@/components/ui/button'
import { colors } from '@/config/colors'
import { paths } from '@/config/paths'

const Home = () => {
  const navigate = useNavigate()

  const handleGetStarted = () => {
    navigate(paths.login.getHref())
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <>
      <Head description="Task management made simple and beautiful" />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            <motion.div
              variants={itemVariants}
              className="flex justify-center mb-12"
            >
              <img src={logo} alt="Logo" className="h-32 w-auto" />
            </motion.div>
            <motion.h1
              variants={itemVariants}
              className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6"
            >
              Todo Management
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl text-gray-600 max-w-2xl mx-auto mb-16"
            >
              Quản lý công việc hàng ngày của bạn một cách đơn giản và hiệu quả
            </motion.p>

            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto mb-16"
            >
              <motion.div variants={itemVariants} className="text-center">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ListTodo className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Dễ sử dụng</h3>
                <p className="text-sm text-gray-600">
                  Giao diện đơn giản, trực quan
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="text-center">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Theo dõi tiến độ
                </h3>
                <p className="text-sm text-gray-600">
                  Quản lý công việc hiệu quả
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="text-center">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Tiết kiệm thời gian
                </h3>
                <p className="text-sm text-gray-600">
                  Tổ chức công việc gọn gàng
                </p>
              </motion.div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button
                onClick={handleGetStarted}
                className="rounded-lg px-8 py-6 text-lg font-medium text-white shadow-md hover:shadow-lg transition-all"
                style={{ backgroundColor: colors.brand.primary }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    colors.brand.primaryHover)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = colors.brand.primary)
                }
              >
                Bắt đầu ngay
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default Home
