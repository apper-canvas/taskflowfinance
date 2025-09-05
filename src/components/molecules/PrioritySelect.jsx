import { useState } from "react";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const PrioritySelect = ({ value, onChange, className }) => {
  const [isOpen, setIsOpen] = useState(false);

  const priorities = [
    { value: "high", label: "High Priority", color: "high" },
    { value: "medium", label: "Medium Priority", color: "medium" },
    { value: "low", label: "Low Priority", color: "low" },
  ];

  const selectedPriority = priorities.find(p => p.value === value) || priorities[1];

  const handleSelect = (priority) => {
    onChange?.(priority.value);
    setIsOpen(false);
  };

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      >
        <div className="flex items-center space-x-2">
          <Badge variant={selectedPriority.color}>
            {selectedPriority.label}
          </Badge>
        </div>
        <ApperIcon 
          name="ChevronDown" 
          className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")}
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
          {priorities.map((priority) => (
            <button
              key={priority.value}
              type="button"
              onClick={() => handleSelect(priority)}
              className="flex items-center w-full px-3 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
            >
              <Badge variant={priority.color}>
                {priority.label}
              </Badge>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PrioritySelect;