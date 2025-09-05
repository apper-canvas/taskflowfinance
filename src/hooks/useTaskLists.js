import { useState, useEffect } from "react";
import { taskListService } from "@/services/api/taskListService";
import { toast } from "react-toastify";

export const useTaskLists = () => {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadLists = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await taskListService.getAll();
      setLists(data);
    } catch (err) {
      setError("Failed to load lists");
      console.error("Error loading lists:", err);
    } finally {
      setLoading(false);
    }
  };

  const createList = async (listData) => {
    try {
      const newList = await taskListService.create(listData);
      setLists(prev => [...prev, newList]);
      toast.success(`List "${newList.name}" created!`);
      return newList;
    } catch (err) {
      toast.error("Failed to create list");
      throw err;
    }
  };

  const updateList = async (id, data) => {
    try {
      const updatedList = await taskListService.update(id, data);
      setLists(prev => prev.map(l => l.id === id ? updatedList : l));
      toast.success("List updated successfully!");
      return updatedList;
    } catch (err) {
      toast.error("Failed to update list");
      throw err;
    }
  };

  const deleteList = async (id) => {
    try {
      const deletedList = await taskListService.delete(id);
      setLists(prev => prev.filter(l => l.id !== id));
      toast.success(`List "${deletedList.name}" deleted`);
      return deletedList;
    } catch (err) {
      toast.error("Failed to delete list");
      throw err;
    }
  };

  const getListById = (id) => {
    return lists.find(l => l.id === id) || null;
  };

  useEffect(() => {
    loadLists();
  }, []);

  return {
    lists,
    loading,
    error,
    loadLists,
    createList,
    updateList,
    deleteList,
    getListById
  };
};