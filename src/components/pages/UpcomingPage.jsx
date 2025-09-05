import { useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import { useTaskLists } from "@/hooks/useTaskLists";
import TaskList from "@/components/organisms/TaskList";
import TaskModal from "@/components/organisms/TaskModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { format, parseISO, isSameDay } from "date-fns";

const UpcomingPage = () => {
  const { tasks, loading, error, loadTasks, createTask, updateTask, toggleTaskComplete, deleteTask } = useTasks(null, "upcoming");
  const { lists } = useTaskLists();
  
  const [editingTask, setEditingTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, taskData);
      } else {
        await createTask(taskData);
      }
      setEditingTask(null);
    } catch (err) {
      console.error("Error saving task:", err);
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      await deleteTask(id);
    }
  };

  const handleCloseModal = () => {
    setShowTaskModal(false);
    setEditingTask(null);
  };

  // Group tasks by date
const groupedTasks = tasks.reduce((groups, task) => {
    if (!task.due_date_c) return groups;
    
    const date = format(parseISO(task.due_date_c), "yyyy-MM-dd");
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(task);
    return groups;
  }, {});

  const sortedDates = Object.keys(groupedTasks).sort();

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadTasks} />;

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <ApperIcon name="Clock" className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Upcoming</h1>
        </div>
        <p className="text-gray-600">
          {tasks.length} upcoming tasks scheduled
        </p>
      </div>

      {sortedDates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-4">
            <ApperIcon name="Clock" className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No upcoming tasks
          </h3>
          <p className="text-gray-500 text-center mb-6 max-w-md">
            All your tasks are either completed or due today. Great job staying on top of things!
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {sortedDates.map(dateKey => {
            const date = parseISO(dateKey);
            const dateTasks = groupedTasks[dateKey];
            
            return (
              <div key={dateKey}>
                <div className="flex items-center space-x-3 mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {format(date, "EEEE, MMMM d")}
                  </h2>
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                    {dateTasks.length} tasks
                  </span>
                </div>
                
                <TaskList
                  tasks={dateTasks}
                  onToggleComplete={toggleTaskComplete}
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                />
              </div>
            );
          })}
        </div>
      )}

      <TaskModal
        isOpen={showTaskModal}
        onClose={handleCloseModal}
        onSave={handleSaveTask}
        task={editingTask}
        lists={lists}
      />
    </div>
  );
};

export default UpcomingPage;