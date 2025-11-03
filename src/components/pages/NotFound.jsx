import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
          className="w-24 h-24 bg-gradient-to-br from-primary/20 to-accent/10 rounded-full flex items-center justify-center mb-8 mx-auto"
        >
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-primary" />
        </motion.div>

        <h1 className="text-6xl font-display font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-display font-semibold text-gray-700 mb-4">Page Not Found</h2>
        
        <p className="text-gray-600 mb-8 max-w-md mx-auto font-body text-lg">
          The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/"
            className="bg-gradient-to-r from-primary to-accent text-white px-8 py-4 rounded-lg font-medium font-body transition-all duration-200 hover:shadow-lg inline-flex items-center gap-2"
          >
            <ApperIcon name="Home" className="w-4 h-4" />
            Back to Home
          </Link>
          
          <Link
            to="/search"
            className="bg-white text-gray-700 border-2 border-gray-200 px-8 py-4 rounded-lg font-medium font-body transition-all duration-200 hover:border-primary hover:text-primary inline-flex items-center gap-2"
          >
            <ApperIcon name="Search" className="w-4 h-4" />
            Search Products
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default NotFound