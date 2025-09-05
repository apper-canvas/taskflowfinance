import { toast } from "react-toastify";

const STAFF_TABLE = "staff_c";

class StaffService {
  constructor() {
    this.apperClient = null;
    this.initializeClient();
  }

  initializeClient() {
    if (typeof window !== 'undefined' && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
  }

  async getAll() {
    try {
      if (!this.apperClient) this.initializeClient();

      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "role_c" } },
          { field: { Name: "department_c" } },
          { field: { Name: "hire_date_c" } },
          { field: { Name: "notes_c" } }
        ],
        orderBy: [{ fieldName: "name_c", sorttype: "ASC" }],
        pagingInfo: { limit: 100, offset: 0 }
      };

      const response = await this.apperClient.fetchRecords(STAFF_TABLE, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching staff:", error?.response?.data?.message || error);
      toast.error("Failed to load staff members");
      return [];
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initializeClient();

      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "role_c" } },
          { field: { Name: "department_c" } },
          { field: { Name: "hire_date_c" } },
          { field: { Name: "notes_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(STAFF_TABLE, id, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching staff member ${id}:`, error?.response?.data?.message || error);
      toast.error("Failed to load staff member");
      return null;
    }
  }

  async create(staffData) {
    try {
      if (!this.apperClient) this.initializeClient();

      // Only include updateable fields
      const params = {
        records: [{
          Name: staffData.name_c || staffData.Name,
          Tags: staffData.Tags || "",
          name_c: staffData.name_c,
          email_c: staffData.email_c,
          phone_c: staffData.phone_c || "",
          role_c: staffData.role_c,
          department_c: staffData.department_c || "",
          hire_date_c: staffData.hire_date_c ? new Date(staffData.hire_date_c).toISOString().split('T')[0] : null,
          notes_c: staffData.notes_c || ""
        }]
      };

      const response = await this.apperClient.createRecord(STAFF_TABLE, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} staff records:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success("Staff member created successfully!");
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating staff member:", error?.response?.data?.message || error);
      toast.error("Failed to create staff member");
      return null;
    }
  }

  async update(id, staffData) {
    try {
      if (!this.apperClient) this.initializeClient();

      // Only include updateable fields
      const params = {
        records: [{
          Id: id,
          Name: staffData.name_c || staffData.Name,
          Tags: staffData.Tags || "",
          name_c: staffData.name_c,
          email_c: staffData.email_c,
          phone_c: staffData.phone_c || "",
          role_c: staffData.role_c,
          department_c: staffData.department_c || "",
          hire_date_c: staffData.hire_date_c ? new Date(staffData.hire_date_c).toISOString().split('T')[0] : null,
          notes_c: staffData.notes_c || ""
        }]
      };

      const response = await this.apperClient.updateRecord(STAFF_TABLE, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} staff records:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success("Staff member updated successfully!");
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating staff member:", error?.response?.data?.message || error);
      toast.error("Failed to update staff member");
      return null;
    }
  }

  async delete(id) {
    try {
      if (!this.apperClient) this.initializeClient();

      const params = {
        RecordIds: [id]
      };

      const response = await this.apperClient.deleteRecord(STAFF_TABLE, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} staff records:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success("Staff member deleted successfully");
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error deleting staff member:", error?.response?.data?.message || error);
      toast.error("Failed to delete staff member");
      return false;
    }
  }

  async search(query) {
    try {
      if (!this.apperClient) this.initializeClient();

      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "role_c" } },
          { field: { Name: "department_c" } },
          { field: { Name: "hire_date_c" } },
          { field: { Name: "notes_c" } }
        ],
        whereGroups: [{
          operator: "OR",
          subGroups: [{
            conditions: [
              { fieldName: "name_c", operator: "Contains", values: [query] },
              { fieldName: "email_c", operator: "Contains", values: [query] },
              { fieldName: "department_c", operator: "Contains", values: [query] },
              { fieldName: "role_c", operator: "Contains", values: [query] }
            ],
            operator: "OR"
          }]
        }],
        orderBy: [{ fieldName: "name_c", sorttype: "ASC" }],
        pagingInfo: { limit: 100, offset: 0 }
      };

      const response = await this.apperClient.fetchRecords(STAFF_TABLE, params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error searching staff:", error?.response?.data?.message || error);
      return [];
    }
  }
}

export const staffService = new StaffService();