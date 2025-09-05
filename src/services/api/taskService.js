import { toast } from "react-toastify";

const TASK_TABLE = "task_c";

export const taskService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "position_c"}},
          {"field": {"Name": "list_id_c"}}
        ],
        orderBy: [{"fieldName": "position_c", "sorttype": "ASC"}],
        pagingInfo: {"limit": 1000, "offset": 0}
      };

      const response = await apperClient.fetchRecords(TASK_TABLE, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks");
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "position_c"}},
          {"field": {"Name": "list_id_c"}}
        ]
      };

      const response = await apperClient.getRecordById(TASK_TABLE, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data || null;
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error);
      return null;
    }
  },

  async getByListId(listId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "position_c"}},
          {"field": {"Name": "list_id_c"}}
        ],
        where: [{"FieldName": "list_id_c", "Operator": "EqualTo", "Values": [parseInt(listId)]}],
        orderBy: [{"fieldName": "position_c", "sorttype": "ASC"}],
        pagingInfo: {"limit": 1000, "offset": 0}
      };

      const response = await apperClient.fetchRecords(TASK_TABLE, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks by list:", error);
      return [];
    }
  },

  async getTodayTasks() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "position_c"}},
          {"field": {"Name": "list_id_c"}}
        ],
        whereGroups: [{
          "operator": "AND",
          "subGroups": [
            {
              "conditions": [
                {"fieldName": "due_date_c", "operator": "GreaterThanOrEqualTo", "values": [today.toISOString()]},
                {"fieldName": "due_date_c", "operator": "LessThan", "values": [tomorrow.toISOString()]}
              ],
              "operator": "AND"
            }
          ]
        }],
        orderBy: [{"fieldName": "position_c", "sorttype": "ASC"}],
        pagingInfo: {"limit": 1000, "offset": 0}
      };

      const response = await apperClient.fetchRecords(TASK_TABLE, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching today's tasks:", error);
      return [];
    }
  },

  async getUpcomingTasks() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "position_c"}},
          {"field": {"Name": "list_id_c"}}
        ],
        where: [{"FieldName": "due_date_c", "Operator": "GreaterThanOrEqualTo", "Values": [tomorrow.toISOString()]}],
        orderBy: [{"fieldName": "due_date_c", "sorttype": "ASC"}],
        pagingInfo: {"limit": 1000, "offset": 0}
      };

      const response = await apperClient.fetchRecords(TASK_TABLE, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching upcoming tasks:", error);
      return [];
    }
  },

  async create(taskData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Prepare data with correct field names and only Updateable fields
      const params = {
        records: [{
          title_c: taskData.title || taskData.title_c,
          description_c: taskData.description || taskData.description_c,
          priority_c: taskData.priority || taskData.priority_c || "medium",
          due_date_c: taskData.dueDate || taskData.due_date_c || null,
          completed_c: false,
          completed_at_c: null,
          position_c: taskData.position || taskData.position_c || 0,
          list_id_c: taskData.listId || taskData.list_id_c
        }]
      };

      const response = await apperClient.createRecord(TASK_TABLE, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          return successful[0].data;
        }
      }

      throw new Error("Failed to create task");
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task");
      throw error;
    }
  },

  async update(id, data) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Prepare data with correct field names and only Updateable fields
      const updateData = {
        Id: parseInt(id)
      };

      // Map field names from mock data format to database format
      if (data.title !== undefined) updateData.title_c = data.title;
      if (data.title_c !== undefined) updateData.title_c = data.title_c;
      if (data.description !== undefined) updateData.description_c = data.description;
      if (data.description_c !== undefined) updateData.description_c = data.description_c;
      if (data.priority !== undefined) updateData.priority_c = data.priority;
      if (data.priority_c !== undefined) updateData.priority_c = data.priority_c;
      if (data.dueDate !== undefined) updateData.due_date_c = data.dueDate;
      if (data.due_date_c !== undefined) updateData.due_date_c = data.due_date_c;
      if (data.completed !== undefined) updateData.completed_c = data.completed;
      if (data.completed_c !== undefined) updateData.completed_c = data.completed_c;
      if (data.completedAt !== undefined) updateData.completed_at_c = data.completedAt;
      if (data.completed_at_c !== undefined) updateData.completed_at_c = data.completed_at_c;
      if (data.position !== undefined) updateData.position_c = data.position;
      if (data.position_c !== undefined) updateData.position_c = data.position_c;
      if (data.listId !== undefined) updateData.list_id_c = data.listId;
      if (data.list_id_c !== undefined) updateData.list_id_c = data.list_id_c;

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord(TASK_TABLE, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          return successful[0].data;
        }
      }

      throw new Error("Failed to update task");
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
      throw error;
    }
  },

  async toggleComplete(id) {
    try {
      // First get the current task
      const currentTask = await this.getById(id);
      if (!currentTask) {
        throw new Error("Task not found");
      }

      const wasCompleted = currentTask.completed_c;
      const updateData = {
        completed_c: !wasCompleted,
        completed_at_c: !wasCompleted ? new Date().toISOString() : null
      };

      return await this.update(id, updateData);
    } catch (error) {
      console.error("Error toggling task completion:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = { 
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord(TASK_TABLE, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0;
      }

      return false;
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
      throw error;
    }
  },

  async reorderTasks(reorderedTasks) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const updateRecords = reorderedTasks.map((task, index) => ({
        Id: task.Id,
        position_c: index
      }));

      const params = {
        records: updateRecords
      };

      const response = await apperClient.updateRecord(TASK_TABLE, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      return reorderedTasks;
    } catch (error) {
      console.error("Error reordering tasks:", error);
      throw error;
    }
  },

  async search(query) {
    try {
      if (!query.trim()) {
        return this.getAll();
      }

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "position_c"}},
          {"field": {"Name": "list_id_c"}}
        ],
        whereGroups: [{
          "operator": "OR",
          "subGroups": [
            {
              "conditions": [
                {"fieldName": "title_c", "operator": "Contains", "values": [query]},
                {"fieldName": "description_c", "operator": "Contains", "values": [query]}
              ],
              "operator": "OR"
            }
          ]
        }],
        orderBy: [{"fieldName": "position_c", "sorttype": "ASC"}],
        pagingInfo: {"limit": 1000, "offset": 0}
      };

      const response = await apperClient.fetchRecords(TASK_TABLE, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error searching tasks:", error);
      return [];
    }
  }
};