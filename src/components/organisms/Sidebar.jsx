import { useState } from "react";
import { NavLink } from "react-router-dom";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ 
  lists = [], 
  onAddList, 
  className,
  isMobile = false,
  isOpen = false,
  onClose,
}) => {
  const [showAddList, setShowAddList] = useState(false);
  const [newListName, setNewListName] = useState("");

  const handleAddList = () => {
    if (newListName.trim()) {
      onAddList?.({
        name: newListName.trim(),
        color: "#8B5CF6",
        icon: "List",
      });
      setNewListName("");
      setShowAddList(false);
    }
  };

const navItems = [
    { 
      path: "/", 
      label: "All Tasks", 
      icon: "Inbox", 
      count: lists.reduce((sum, list) => sum + list.taskCount, 0) 
    },
    { 
      path: "/today", 
      label: "Today", 
      icon: "Calendar", 
      count: 0 
    },
    { 
      path: "/upcoming", 
      label: "Upcoming", 
      icon: "Clock", 
      count: 0 
    },
    { 
      path: "/staff", 
      label: "Staff", 
      icon: "Users", 
      count: 0 
    },
  ];

  const sidebarContent = (
    <>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckSquare" className="h-5 w-5 text-white" />
            </div>
            <h1 className="font-display font-bold text-xl text-gray-900">
              TaskFlow
            </h1>
          </div>
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <ApperIcon name="X" className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      <nav className="flex-1 px-4">
        {/* Main navigation */}
        <div className="space-y-1 mb-8">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary-100 text-primary-900"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                )
              }
              onClick={isMobile ? onClose : undefined}
            >
              <div className="flex items-center space-x-3">
                <ApperIcon name={item.icon} className="h-4 w-4" />
                <span>{item.label}</span>
              </div>
              {item.count > 0 && (
                <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                  {item.count}
                </span>
              )}
            </NavLink>
          ))}
        </div>

        {/* Lists section */}
        <div>
          <div className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            <span>Lists</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAddList(true)}
              className="h-5 w-5 p-0"
            >
              <ApperIcon name="Plus" className="h-3 w-3" />
            </Button>
          </div>

          <div className="space-y-1">
            {lists.map((list) => (
              <NavLink
                key={list.id}
                to={`/list/${list.id}`}
                className={({ isActive }) =>
                  cn(
                    "flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary-100 text-primary-900"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  )
                }
                onClick={isMobile ? onClose : undefined}
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: list.color }}
                  />
                  <span>{list.name}</span>
                </div>
                {list.taskCount > 0 && (
                  <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                    {list.taskCount}
                  </span>
                )}
              </NavLink>
            ))}
          </div>

          {/* Add new list form */}
          {showAddList && (
            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="List name"
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleAddList();
                  }
                  if (e.key === "Escape") {
                    setShowAddList(false);
                    setNewListName("");
                  }
                }}
                autoFocus
              />
              <div className="flex justify-end space-x-1 mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowAddList(false);
                    setNewListName("");
                  }}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleAddList}
                  className="text-xs"
                >
                  Add
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );

  if (isMobile) {
    return (
      <>
        {/* Mobile backdrop */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}

        {/* Mobile sidebar */}
        <div
          className={cn(
            "fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 z-50 lg:hidden",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="h-full flex flex-col">
            {sidebarContent}
          </div>
        </div>
      </>
    );
  }

  // Desktop sidebar
  return (
    <div className={cn(
      "hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-gray-200",
      className
    )}>
      {sidebarContent}
    </div>
  );
};

export default Sidebar;