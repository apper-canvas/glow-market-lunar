import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({
  className,
  type = "text",
  error = false,
  ...props
}, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-12 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-base font-body placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
        error && "border-error focus:ring-error",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;