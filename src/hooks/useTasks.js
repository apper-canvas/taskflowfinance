import { useState, useEffect } from "react";
import { taskService } from "@/services/api/taskService";
import { taskListService } from "@/services/api/taskListService";
import { toast } from "react-toastify";

export const useTasks = (listId = null, view = "all") => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let data;
      if (view === "today") {
        data = await taskService.getTodayTasks();
      } else if (view === "upcoming") {
        data = await taskService.getUpcomingTasks();
      } else if (listId) {
        data = await taskService.getByListId(listId);
      } else {
        data = await taskService.getAll();
      }
      
      setTasks(data);
    } catch (err) {
      setError("Failed to load tasks");
      console.error("Error loading tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData) => {
    try {
      const newTask = await taskService.create(taskData);
      setTasks(prev => [...prev, newTask]);
      
      // Update list task count
      if (taskData.listId) {
        const currentTasks = await taskService.getByListId(taskData.listId);
        await taskListService.updateTaskCount(taskData.listId, currentTasks.length);
      }
      
      toast.success("Task created successfully!");
      return newTask;
    } catch (err) {
      toast.error("Failed to create task");
      throw err;
    }
  };

const updateTask = async (id, data) => {
    try {
      const updatedTask = await taskService.update(id, data);
      setTasks(prev => prev.map(t => t.Id === id ? updatedTask : t));
      toast.success("Task updated successfully!");
      return updatedTask;
    } catch (err) {
      toast.error("Failed to update task");
      throw err;
    }
  };

const toggleTaskComplete = async (id) => {
    try {
      const updatedTask = await taskService.toggleComplete(id);
      setTasks(prev => prev.map(t => t.Id === id ? updatedTask : t));
      
      if (updatedTask.completed_c) {
        toast.success("Task completed! 🎉");
      } else {
        toast.success("Task marked as incomplete");
      }
      
      return updatedTask;
    } catch (err) {
      toast.error("Failed to update task");
      throw err;
    }
  };

const deleteTask = async (id) => {
    try {
      const deletedTask = await taskService.delete(id);
      setTasks(prev => prev.filter(t => t.Id !== id));
      
      // Update list task count if needed
      if (deletedTask && deletedTask.list_id_c) {
        const currentTasks = await taskService.getByListId(deletedTask.list_id_c);
        await taskListService.updateTaskCount(deletedTask.list_id_c, currentTasks.length);
      }
      
      toast.success("Task deleted successfully");
      return deletedTask;
    } catch (err) {
      toast.error("Failed to delete task");
      throw err;
    }
  };

  const reorderTasks = async (reorderedTasks) => {
    try {
      setTasks(reorderedTasks);
      await taskService.reorderTasks(reorderedTasks);
    } catch (err) {
      toast.error("Failed to reorder tasks");
      // Reload tasks on error
      loadTasks();
    }
  };

  const searchTasks = async (query) => {
    try {
      setLoading(true);
      setError(null);
      const results = await taskService.search(query);
      setTasks(results);
    } catch (err) {
      setError("Failed to search tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [listId, view]);

  return {
    tasks,
    loading,
    error,
    loadTasks,
    createTask,
    updateTask,
    toggleTaskComplete,
    deleteTask,
    reorderTasks,
    searchTasks
  };
};