import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import React from "react";
import { cn } from "@/utils/cn";
const CategoryCard = ({ category, size = "md" }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/category/${category.slug}`);
  };

  const sizeClasses = {
    sm: "aspect-[4/3] text-base",
    md: "aspect-square text-lg",
    lg: "aspect-[3/2] text-xl"
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className={cn(
        "relative overflow-hidden rounded-xl cursor-pointer group",
        sizeClasses[size]
      )}
    >
      <div className="absolute inset-0">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20 group-hover:from-black/70 group-hover:to-black/30 transition-all duration-300" />
      </div>
      
      <div className="relative z-10 h-full flex flex-col justify-end p-6">
        <h3 className="font-display font-bold text-white mb-2">
          {category.name}
        </h3>
        <p className="text-white/90 text-sm font-body line-clamp-2">
          {category.description}
        </p>
      </div>
    </motion.div>
  );
};

export default CategoryCard;