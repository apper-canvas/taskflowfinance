import { useState, useEffect } from "react";
import { staffService } from "@/services/api/staffService";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import StaffModal from "@/components/organisms/StaffModal";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";
import { formatFullDate } from "@/utils/date";
import { toast } from "react-toastify";

const StaffPage = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [selectedRole, setSelectedRole] = useState("all");

  const roles = ["Manager", "Developer", "Designer", "QA", "Support"];

  const loadStaff = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await staffService.getAll();
      setStaff(data);
      setFilteredStaff(data);
    } catch (err) {
      setError("Failed to load staff members");
      console.error("Error loading staff:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredStaff(staff);
      return;
    }

    try {
      const results = await staffService.search(query);
      setFilteredStaff(results);
    } catch (err) {
      console.error("Error searching staff:", err);
      setFilteredStaff(staff);
    }
  };

  const handleRoleFilter = (role) => {
    setSelectedRole(role);
    
    let filtered = staff;
    if (searchQuery.trim()) {
      // If there's a search query, start with search results
      filtered = filteredStaff;
    }
    
    if (role !== "all") {
      filtered = filtered.filter(member => member.role_c === role);
    }
    
    setFilteredStaff(filtered);
  };

  const handleAddStaff = () => {
    setEditingStaff(null);
    setShowStaffModal(true);
  };

  const handleEditStaff = (staffMember) => {
    setEditingStaff(staffMember);
    setShowStaffModal(true);
  };

  const handleDeleteStaff = async (id) => {
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      const success = await staffService.delete(id);
      if (success) {
        setStaff(prev => prev.filter(s => s.Id !== id));
        setFilteredStaff(prev => prev.filter(s => s.Id !== id));
      }
    }
  };

  const handleSaveStaff = async (staffData) => {
    try {
      let savedStaff;
      
      if (editingStaff) {
        savedStaff = await staffService.update(editingStaff.Id, staffData);
        if (savedStaff) {
          setStaff(prev => prev.map(s => s.Id === editingStaff.Id ? savedStaff : s));
          setFilteredStaff(prev => prev.map(s => s.Id === editingStaff.Id ? savedStaff : s));
        }
      } else {
        savedStaff = await staffService.create(staffData);
        if (savedStaff) {
          setStaff(prev => [...prev, savedStaff]);
          setFilteredStaff(prev => [...prev, savedStaff]);
        }
      }

      if (savedStaff) {
        setShowStaffModal(false);
        setEditingStaff(null);
      }
    } catch (err) {
      console.error("Error saving staff:", err);
    }
  };

  const handleCloseModal = () => {
    setShowStaffModal(false);
    setEditingStaff(null);
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      Manager: "bg-purple-100 text-purple-800",
      Developer: "bg-blue-100 text-blue-800",
      Designer: "bg-pink-100 text-pink-800",
      QA: "bg-green-100 text-green-800",
      Support: "bg-yellow-100 text-yellow-800"
    };
    return colors[role] || "bg-gray-100 text-gray-800";
  };

  useEffect(() => {
    loadStaff();
  }, []);

  useEffect(() => {
    // Reapply filters when staff data changes
    if (selectedRole !== "all" || searchQuery.trim()) {
      let filtered = staff;
      
      if (searchQuery.trim()) {
        handleSearch(searchQuery);
        return;
      }
      
      if (selectedRole !== "all") {
        filtered = filtered.filter(member => member.role_c === selectedRole);
      }
      
      setFilteredStaff(filtered);
    } else {
      setFilteredStaff(staff);
    }
  }, [staff, selectedRole]);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadStaff} />;

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Staff Management</h1>
            <p className="text-gray-600">
              {staff.length} staff members total
            </p>
          </div>
          <Button onClick={handleAddStaff} className="flex items-center space-x-2">
            <ApperIcon name="UserPlus" className="h-4 w-4" />
            <span>Add Staff</span>
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search staff members..."
              className="w-full"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Role:</label>
            <select
              value={selectedRole}
              onChange={(e) => handleRoleFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
            >
              <option value="all">All Roles</option>
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredStaff.length === 0 ? (
        <div className="text-center py-12">
          <ApperIcon name="Users" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No staff members found</h3>
          <p className="text-gray-600 mb-6">
            {searchQuery || selectedRole !== "all" 
              ? "Try adjusting your search or filter criteria"
              : "Get started by adding your first staff member"
            }
          </p>
          {!searchQuery && selectedRole === "all" && (
            <Button onClick={handleAddStaff}>
              Add Staff Member
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStaff.map((member) => (
            <div
              key={member.Id}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-card hover:shadow-card-hover transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                    {member.name_c?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {member.name_c || "Unnamed"}
                    </h3>
                    {member.role_c && (
                      <span className={cn(
                        "inline-block px-2 py-1 rounded-full text-xs font-medium",
                        getRoleBadgeColor(member.role_c)
                      )}>
                        {member.role_c}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditStaff(member)}
                    className="p-2"
                  >
                    <ApperIcon name="Edit" className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteStaff(member.Id)}
                    className="p-2 text-red-600 hover:text-red-700"
                  >
                    <ApperIcon name="Trash2" className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {member.email_c && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <ApperIcon name="Mail" className="h-4 w-4" />
                    <span>{member.email_c}</span>
                  </div>
                )}
                
                {member.phone_c && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <ApperIcon name="Phone" className="h-4 w-4" />
                    <span>{member.phone_c}</span>
                  </div>
                )}
                
                {member.department_c && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <ApperIcon name="Building" className="h-4 w-4" />
                    <span>{member.department_c}</span>
                  </div>
                )}
                
                {member.hire_date_c && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <ApperIcon name="Calendar" className="h-4 w-4" />
                    <span>Hired {formatFullDate(member.hire_date_c)}</span>
                  </div>
                )}
              </div>

              {member.notes_c && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {member.notes_c}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <StaffModal
        isOpen={showStaffModal}
        onClose={handleCloseModal}
        onSave={handleSaveStaff}
        staff={editingStaff}
      />
    </div>
  );
};

export default StaffPage;