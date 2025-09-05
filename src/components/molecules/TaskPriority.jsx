import Badge from "@/components/atoms/Badge";

const TaskPriority = ({ priority, className }) => {
  const getPriorityConfig = (priority) => {
    switch (priority) {
      case "high":
        return { variant: "high", label: "High" };
      case "medium":
        return { variant: "medium", label: "Medium" };
      case "low":
        return { variant: "low", label: "Low" };
      default:
        return { variant: "medium", label: "Medium" };
    }
  };

  const config = getPriorityConfig(priority);

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
};

export default TaskPriority;