import { toast } from "react-toastify";

const TASK_LIST_TABLE = "task_list_c";

export const taskListService = {
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
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "icon_c"}},
          {"field": {"Name": "position_c"}},
          {"field": {"Name": "task_count_c"}}
        ],
        orderBy: [{"fieldName": "position_c", "sorttype": "ASC"}],
        pagingInfo: {"limit": 1000, "offset": 0}
      };

      const response = await apperClient.fetchRecords(TASK_LIST_TABLE, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching task lists:", error);
      toast.error("Failed to load task lists");
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
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "icon_c"}},
          {"field": {"Name": "position_c"}},
          {"field": {"Name": "task_count_c"}}
        ]
      };

      const response = await apperClient.getRecordById(TASK_LIST_TABLE, id, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data || null;
    } catch (error) {
      console.error(`Error fetching task list ${id}:`, error);
      return null;
    }
  },

  async create(listData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Prepare data with correct field names and only Updateable fields
      const params = {
        records: [{
          Name: listData.name || listData.name_c,
          name_c: listData.name || listData.name_c,
          color_c: listData.color || listData.color_c || "#8B5CF6",
          icon_c: listData.icon || listData.icon_c || "List",
          position_c: listData.position || listData.position_c || 0,
          task_count_c: 0
        }]
      };

      const response = await apperClient.createRecord(TASK_LIST_TABLE, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} task lists:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          return successful[0].data;
        }
      }

      throw new Error("Failed to create task list");
    } catch (error) {
      console.error("Error creating task list:", error);
      toast.error("Failed to create task list");
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
      if (data.name !== undefined) {
        updateData.Name = data.name;
        updateData.name_c = data.name;
      }
      if (data.name_c !== undefined) {
        updateData.name_c = data.name_c;
        updateData.Name = data.name_c;
      }
      if (data.color !== undefined) updateData.color_c = data.color;
      if (data.color_c !== undefined) updateData.color_c = data.color_c;
      if (data.icon !== undefined) updateData.icon_c = data.icon;
      if (data.icon_c !== undefined) updateData.icon_c = data.icon_c;
      if (data.position !== undefined) updateData.position_c = data.position;
      if (data.position_c !== undefined) updateData.position_c = data.position_c;
      if (data.taskCount !== undefined) updateData.task_count_c = data.taskCount;
      if (data.task_count_c !== undefined) updateData.task_count_c = data.task_count_c;

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord(TASK_LIST_TABLE, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} task lists:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          return successful[0].data;
        }
      }

      throw new Error("Failed to update task list");
    } catch (error) {
      console.error("Error updating task list:", error);
      toast.error("Failed to update task list");
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

      const response = await apperClient.deleteRecord(TASK_LIST_TABLE, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} task lists:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0;
      }

      return false;
    } catch (error) {
      console.error("Error deleting task list:", error);
      toast.error("Failed to delete task list");
      throw error;
    }
  },

  async updateTaskCount(id, count) {
    try {
      return await this.update(id, { task_count_c: count });
    } catch (error) {
      console.error("Error updating task count:", error);
      return null;
    }
  }
};