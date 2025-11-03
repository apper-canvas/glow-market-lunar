import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  icon = "Package", 
  title = "No items found", 
  message = "There are no items to display at the moment.", 
  actionLabel = null, 
  onAction = null 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-6 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1 }}
        className="w-24 h-24 bg-gradient-to-br from-primary/20 to-accent/10 rounded-full flex items-center justify-center mb-6"
      >
        <ApperIcon name={icon} className="w-12 h-12 text-primary" />
      </motion.div>

      <h3 className="text-2xl font-display font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md font-body text-lg">
        {message}
      </p>

      {actionLabel && onAction && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAction}
          className="bg-gradient-to-r from-primary to-accent text-white px-8 py-4 rounded-lg font-medium font-body transition-all duration-200 hover:shadow-lg"
        >
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  );
};

export default Empty;