import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Rating from "@/components/atoms/Rating";
import Button from "@/components/atoms/Button";

const ReviewCard = ({ review, onMarkHelpful }) => {
  const handleHelpful = () => {
    if (onMarkHelpful) {
      onMarkHelpful(review.Id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface p-6 rounded-xl shadow-card"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Rating rating={review.rating} size="sm" />
            <span className="text-sm font-body text-gray-600">
              {format(new Date(review.date), "MMM dd, yyyy")}
            </span>
          </div>
          <h4 className="font-display font-semibold text-gray-900 mb-1">
            {review.title}
          </h4>
          <p className="text-sm font-body text-secondary">
            by {review.reviewerName}
          </p>
        </div>
      </div>

      <p className="text-gray-700 font-body mb-4 leading-relaxed">
        {review.content}
      </p>

      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleHelpful}
          className="text-gray-600 hover:text-primary"
        >
          <ApperIcon name="ThumbsUp" className="w-4 h-4 mr-1" />
          Helpful ({review.helpful})
        </Button>
      </div>
    </motion.div>
  );
};

export default ReviewCard;