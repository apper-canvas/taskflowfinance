import { useState } from "react";
import { motion } from "framer-motion";
import Checkbox from "@/components/atoms/Checkbox";
import Button from "@/components/atoms/Button";
import TaskPriority from "@/components/molecules/TaskPriority";
import TaskDate from "@/components/molecules/TaskDate";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const TaskCard = ({ 
  task, 
  onToggleComplete, 
  onEdit, 
  onDelete,
  isDragging = false,
  dragRef,
  ...props 
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleToggleComplete = (e) => {
    e.stopPropagation();
    onToggleComplete?.(task.id);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit?.(task);
    setShowMenu(false);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete?.(task.id);
    setShowMenu(false);
  };

  return (
    <motion.div
      ref={dragRef}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      whileHover={{ scale: 1.02 }}
      className={cn(
        "group bg-white rounded-xl border border-gray-200 p-4 shadow-card hover:shadow-card-hover transition-all duration-200 cursor-pointer",
        task.completed && "opacity-75 bg-gray-50",
        isDragging && "dragging shadow-lg",
        "relative"
      )}
      {...props}
    >
      <div className="flex items-start space-x-3">
        <Checkbox
          checked={task.completed}
          onChange={handleToggleComplete}
          className="mt-0.5 flex-shrink-0"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 
              className={cn(
                "font-medium text-gray-900 text-sm leading-5",
                task.completed && "line-through text-gray-500"
              )}
            >
              {task.title}
            </h3>
            
            <div className="flex items-center space-x-2">
              {task.priority && (
                <TaskPriority priority={task.priority} />
              )}
              
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(!showMenu);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6"
                >
                  <ApperIcon name="MoreVertical" className="h-4 w-4" />
                </Button>
                
                {showMenu && (
                  <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                    <button
                      onClick={handleEdit}
                      className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg"
                    >
                      <ApperIcon name="Edit" className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={handleDelete}
                      className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 last:rounded-b-lg"
                    >
                      <ApperIcon name="Trash2" className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {task.description && (
            <p 
              className={cn(
                "text-sm text-gray-600 mb-2 line-clamp-2",
                task.completed && "line-through text-gray-400"
              )}
            >
              {task.description}
            </p>
          )}
          
          {task.dueDate && (
            <TaskDate date={task.dueDate} />
          )}
        </div>
      </div>

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(false);
          }}
        />
      )}
    </motion.div>
  );
};

export default TaskCard;