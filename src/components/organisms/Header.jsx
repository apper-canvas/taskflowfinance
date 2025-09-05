import { useState } from "react";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Header = ({ 
  onSearch, 
  onQuickAdd, 
  onToggleMobileSidebar,
  className 
}) => {
  return (
    <header className={cn(
      "bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4",
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleMobileSidebar}
            className="lg:hidden"
          >
            <ApperIcon name="Menu" className="h-5 w-5" />
          </Button>

          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckSquare" className="h-5 w-5 text-white" />
            </div>
            <h1 className="font-display font-bold text-xl text-gray-900 hidden sm:block">
              TaskFlow
            </h1>
          </div>
        </div>

        {/* Search bar - hidden on mobile */}
        <div className="hidden md:flex flex-1 max-w-lg mx-8">
          <SearchBar 
            onSearch={onSearch} 
            placeholder="Search tasks..." 
            className="w-full"
          />
        </div>

        {/* Quick add button */}
        <Button
          onClick={onQuickAdd}
          className="flex items-center space-x-2"
        >
          <ApperIcon name="Plus" className="h-4 w-4" />
          <span className="hidden sm:inline">Add Task</span>
        </Button>
      </div>

      {/* Mobile search bar */}
      <div className="md:hidden mt-4">
        <SearchBar 
          onSearch={onSearch} 
          placeholder="Search tasks..." 
        />
      </div>
    </header>
  );
};

export default Header;