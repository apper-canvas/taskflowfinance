import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StaffModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  staff = null, 
  className 
}) => {
  const [formData, setFormData] = useState({
    name_c: "",
    email_c: "",
    phone_c: "",
    role_c: "",
    department_c: "",
    hire_date_c: "",
    notes_c: ""
  });

  const [errors, setErrors] = useState({});

  const roles = ["Manager", "Developer", "Designer", "QA", "Support"];

  useEffect(() => {
    if (staff) {
      setFormData({
        name_c: staff.name_c || "",
        email_c: staff.email_c || "",
        phone_c: staff.phone_c || "",
        role_c: staff.role_c || "",
        department_c: staff.department_c || "",
        hire_date_c: staff.hire_date_c ? staff.hire_date_c.split("T")[0] : "",
        notes_c: staff.notes_c || ""
      });
    } else {
      setFormData({
        name_c: "",
        email_c: "",
        phone_c: "",
        role_c: "",
        department_c: "",
        hire_date_c: "",
        notes_c: ""
      });
    }
    setErrors({});
  }, [staff, isOpen]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name_c.trim()) {
      newErrors.name_c = "Name is required";
    }
    
    if (!formData.email_c.trim()) {
      newErrors.email_c = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_c)) {
      newErrors.email_c = "Please enter a valid email address";
    }
    
    if (!formData.role_c) {
      newErrors.role_c = "Please select a role";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const staffData = {
      name_c: formData.name_c,
      email_c: formData.email_c,
      phone_c: formData.phone_c,
      role_c: formData.role_c,
      department_c: formData.department_c,
      hire_date_c: formData.hire_date_c,
      notes_c: formData.notes_c,
      Name: formData.name_c, // For system Name field
      Tags: "" // Default empty tags
    };

    onSave?.(staffData);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose?.();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={cn(
            "bg-white rounded-xl shadow-xl w-full max-w-lg",
            className
          )}
          onKeyDown={handleKeyDown}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {staff ? "Edit Staff Member" : "Add New Staff Member"}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2"
            >
              <ApperIcon name="X" className="h-4 w-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <FormField
              label="Full Name"
              value={formData.name_c}
              onChange={(e) => handleChange("name_c", e.target.value)}
              error={errors.name_c}
              placeholder="Enter full name..."
              required
              autoFocus
            />

            <FormField
              label="Email Address"
              type="email"
              value={formData.email_c}
              onChange={(e) => handleChange("email_c", e.target.value)}
              error={errors.email_c}
              placeholder="Enter email address..."
              required
            />

            <FormField
              label="Phone Number"
              type="tel"
              value={formData.phone_c}
              onChange={(e) => handleChange("phone_c", e.target.value)}
              error={errors.phone_c}
              placeholder="Enter phone number..."
            />

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.role_c}
                onChange={(e) => handleChange("role_c", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select a role...</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              {errors.role_c && (
                <p className="text-sm text-red-500">{errors.role_c}</p>
              )}
            </div>

            <FormField
              label="Department"
              value={formData.department_c}
              onChange={(e) => handleChange("department_c", e.target.value)}
              error={errors.department_c}
              placeholder="Enter department..."
            />

            <FormField
              label="Hire Date"
              type="date"
              value={formData.hire_date_c}
              onChange={(e) => handleChange("hire_date_c", e.target.value)}
              error={errors.hire_date_c}
            />

            <FormField
              label="Notes"
              value={formData.notes_c}
              onChange={(e) => handleChange("notes_c", e.target.value)}
              error={errors.notes_c}
              placeholder="Additional notes..."
              multiline
              className="min-h-[80px]"
            />

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button type="submit">
                {staff ? "Update Staff Member" : "Add Staff Member"}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default StaffModal;