import { useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import { useTaskLists } from "@/hooks/useTaskLists";
import TaskList from "@/components/organisms/TaskList";
import FilterBar from "@/components/organisms/FilterBar";
import TaskModal from "@/components/organisms/TaskModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { isOverdue, isDueToday, isDueSoon } from "@/utils/date";

const AllTasksPage = () => {
  const { tasks, loading, error, loadTasks, createTask, updateTask, toggleTaskComplete, deleteTask, reorderTasks } = useTasks();
  const { lists } = useTaskLists();
  
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    dueDate: "all",
  });
  
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

  // Apply filters
const filteredTasks = tasks.filter(task => {
    // Status filter
    if (filters.status === "active" && task.completed_c) return false;
    if (filters.status === "completed" && !task.completed_c) return false;

    // Priority filter
    if (filters.priority !== "all" && task.priority_c !== filters.priority) return false;

    // Due date filter
    if (filters.dueDate !== "all") {
      if (filters.dueDate === "overdue" && !isOverdue(task.due_date_c)) return false;
      if (filters.dueDate === "today" && !isDueToday(task.due_date_c)) return false;
      if (filters.dueDate === "upcoming" && !isDueSoon(task.due_date_c)) return false;
    }

    return true;
  });

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadTasks} />;

  return (
    <div className="p-6">
<div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">All Tasks</h1>
        <p className="text-gray-600">
          {tasks.length} tasks total, {tasks.filter(t => !t.completed_c).length} active
        </p>
      </div>

      <FilterBar
        filters={filters}
        onFiltersChange={setFilters}
        className="mb-6"
      />

      <TaskList
        tasks={filteredTasks}
        onToggleComplete={toggleTaskComplete}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
        onReorderTasks={reorderTasks}
        emptyMessage={
          Object.values(filters).some(f => f !== "all")
            ? "No tasks match the selected filters"
            : "No tasks yet. Create your first task to get started!"
        }
      />

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

export default AllTasksPage;