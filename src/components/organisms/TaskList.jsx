import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TaskCard from "./TaskCard";
import Empty from "@/components/ui/Empty";
import { cn } from "@/utils/cn";

const TaskList = ({ 
  tasks = [], 
  onToggleComplete, 
  onEditTask, 
  onDeleteTask,
  onReorderTasks,
  emptyMessage = "No tasks found",
  className 
}) => {
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const dragRef = useRef(null);

  const handleDragStart = (e, task, index) => {
    setDraggedTask({ task, index });
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.outerHTML);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    
    if (draggedTask && draggedTask.index !== dropIndex) {
      const newTasks = [...tasks];
      const [removed] = newTasks.splice(draggedTask.index, 1);
      newTasks.splice(dropIndex, 0, removed);
      
      // Update positions
      const reorderedTasks = newTasks.map((task, index) => ({
        ...task,
        position: index
      }));
      
      onReorderTasks?.(reorderedTasks);
    }
    
    setDraggedTask(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDragOverIndex(null);
  };

  if (!tasks.length) {
    return <Empty message={emptyMessage} />;
  }

  return (
    <div className={cn("space-y-3", className)}>
      <AnimatePresence>
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            draggable
            onDragStart={(e) => handleDragStart(e, task, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            className={cn(
              "transition-all duration-200",
              dragOverIndex === index && "drag-over",
              draggedTask?.index === index && "opacity-50"
            )}
          >
            <TaskCard
              task={task}
              onToggleComplete={onToggleComplete}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              isDragging={draggedTask?.index === index}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TaskList;