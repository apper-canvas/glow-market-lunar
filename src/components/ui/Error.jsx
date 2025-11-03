import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ 
  title = "Something went wrong", 
  message = "We encountered an error while loading your data.", 
  onRetry = null,
  showIcon = true 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      {showIcon && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
          className="w-20 h-20 bg-gradient-to-br from-error/20 to-error/10 rounded-full flex items-center justify-center mb-6"
        >
          <ApperIcon name="AlertTriangle" className="w-10 h-10 text-error" />
        </motion.div>
      )}

      <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md font-body">
        {message}
      </p>

      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="bg-gradient-to-r from-primary to-accent text-white px-6 py-3 rounded-lg font-medium font-body transition-all duration-200 hover:shadow-lg flex items-center gap-2"
        >
          <ApperIcon name="RefreshCw" className="w-4 h-4" />
          Try Again
        </motion.button>
      )}
    </motion.div>
  );
};

export default Error;