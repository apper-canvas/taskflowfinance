import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Checkbox = forwardRef(({ className, checked, onChange, ...props }, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange && onChange(!checked)}
      className={cn(
        "flex h-5 w-5 items-center justify-center rounded border-2 border-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1",
        checked 
          ? "bg-gradient-to-r from-primary-500 to-primary-600 border-primary-500" 
          : "bg-white hover:border-primary-400",
        className
      )}
      {...props}
    >
      {checked && (
        <ApperIcon 
          name="Check" 
          className="h-3 w-3 text-white animate-scale-in" 
        />
      )}
    </button>
  );
});

Checkbox.displayName = "Checkbox";

export default Checkbox;