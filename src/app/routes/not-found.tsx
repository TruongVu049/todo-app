import { motion } from 'framer-motion'

import { Link } from '@/components/ui/link'
import { paths } from '@/config/paths'

const NotFoundRoute = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="mt-52 flex flex-col items-center font-semibold gap-4"
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-6xl font-bold text-gray-900"
      >
        404
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-xl text-gray-600"
      >
        Sorry, the page you are looking for does not exist.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Link to={paths.home.getHref()} replace>
          Go to Home
        </Link>
      </motion.div>
    </motion.div>
  )
}

export default NotFoundRoute
