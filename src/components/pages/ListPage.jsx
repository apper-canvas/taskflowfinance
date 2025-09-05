import { useState } from "react";
import { useParams } from "react-router-dom";
import { useTasks } from "@/hooks/useTasks";
import { useTaskLists } from "@/hooks/useTaskLists";
import TaskList from "@/components/organisms/TaskList";
import TaskModal from "@/components/organisms/TaskModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";

const ListPage = () => {
  const { listId } = useParams();
  const { tasks, loading, error, loadTasks, createTask, updateTask, toggleTaskComplete, deleteTask, reorderTasks } = useTasks(listId);
  const { lists, getListById } = useTaskLists();
  
  const [editingTask, setEditingTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);

  const currentList = getListById(listId);

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, taskData);
      } else {
        await createTask({
          ...taskData,
          listId: listId
        });
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

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadTasks} />;

  if (!currentList) {
    return (
      <div className="p-6">
        <Error message="List not found" />
      </div>
    );
  }

  const completedTasks = tasks.filter(t => t.completed);
  const activeTasks = tasks.filter(t => !t.completed);

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: currentList.color }}
          >
            <ApperIcon name={currentList.icon} className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{currentList.name}</h1>
        </div>
        <p className="text-gray-600">
          {tasks.length} tasks total, {activeTasks.length} active
        </p>

        {tasks.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Tasks</p>
                  <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
                </div>
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <ApperIcon name="List" className="h-5 w-5 text-gray-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active</p>
                  <p className="text-2xl font-bold text-amber-600">{activeTasks.length}</p>
                </div>
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <ApperIcon name="Clock" className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Completed</p>
                  <p className="text-2xl font-bold text-emerald-600">{completedTasks.length}</p>
                </div>
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <ApperIcon name="CheckCircle" className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <TaskList
        tasks={tasks}
        onToggleComplete={toggleTaskComplete}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
        onReorderTasks={reorderTasks}
        emptyMessage={`No tasks in ${currentList.name}`}
        emptyDescription="Add your first task to this list to get started!"
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

export default ListPage;