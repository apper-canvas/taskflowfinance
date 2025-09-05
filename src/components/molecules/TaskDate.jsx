import ApperIcon from "@/components/ApperIcon";
import { formatDate, isOverdue, isDueToday, isDueSoon } from "@/utils/date";
import { cn } from "@/utils/cn";

const TaskDate = ({ date, className }) => {
  if (!date) return null;

const overdue = isOverdue(date);
  const today = isDueToday(date);
  const soon = isDueSoon(date);

  return (
    <div className={cn("flex items-center space-x-1 text-xs", className)}>
      <ApperIcon name="Calendar" className="h-3 w-3" />
      <span
        className={cn(
          "font-medium",
          overdue && "text-red-500",
          today && "text-amber-600",
          soon && "text-blue-500",
          !overdue && !today && !soon && "text-gray-500"
        )}
      >
        {formatDate(date)}
      </span>
    </div>
  );
};

export default TaskDate;