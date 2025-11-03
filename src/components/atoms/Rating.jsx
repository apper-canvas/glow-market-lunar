import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Rating = ({ 
  rating = 0, 
  maxRating = 5, 
  size = "md", 
  showCount = false, 
  count = 0,
  className 
}) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  };

  const stars = Array.from({ length: maxRating }, (_, index) => {
    const starValue = index + 1;
    const isFilled = starValue <= rating;
    const isHalfFilled = starValue - 0.5 <= rating && starValue > rating;

    return (
      <div key={index} className="relative">
        <ApperIcon 
          name="Star" 
          className={cn(
            sizes[size],
            "text-gray-200"
          )}
        />
        {(isFilled || isHalfFilled) && (
          <div 
            className="absolute top-0 left-0 overflow-hidden"
            style={{ width: isHalfFilled ? "50%" : "100%" }}
          >
            <ApperIcon 
              name="Star" 
              className={cn(
                sizes[size],
                "text-accent fill-current"
              )}
            />
          </div>
        )}
      </div>
    );
  });

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center">
        {stars}
      </div>
      {showCount && (
        <span className={cn("text-gray-600 font-body ml-1", textSizes[size])}>
          ({count})
        </span>
      )}
    </div>
  );
};

export default Rating;