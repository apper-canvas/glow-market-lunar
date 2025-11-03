import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const Button = forwardRef(({
  children,
  className,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  ...props
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium font-body transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-accent text-white hover:brightness-110 focus:ring-primary shadow-lg hover:shadow-xl",
    secondary: "border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm h-9",
    md: "px-6 py-3 text-base h-11",
    lg: "px-8 py-4 text-lg h-12",
    icon: "p-2 h-10 w-10"
  };

  return (
    <motion.button
      ref={ref}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
      )}
      {children}
    </motion.button>
  );
});

Button.displayName = "Button";

export default Button;