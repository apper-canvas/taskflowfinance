import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/organisms/Header";
import Sidebar from "@/components/organisms/Sidebar";
import QuickAddModal from "@/components/organisms/QuickAddModal";
import { useTaskLists } from "@/hooks/useTaskLists";
import { useTasks } from "@/hooks/useTasks";

const Layout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { lists, createList } = useTaskLists();
  const { createTask, searchTasks } = useTasks();

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      searchTasks(query);
    }
  };

  const handleQuickAddTask = async (taskData) => {
    try {
      await createTask(taskData);
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <Sidebar
        lists={lists}
        onAddList={createList}
      />

      {/* Mobile Sidebar */}
      <Sidebar
        lists={lists}
        onAddList={createList}
        isMobile={true}
        isOpen={isMobileSidebarOpen}
        onClose={closeMobileSidebar}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          onSearch={handleSearch}
          onQuickAdd={() => setShowQuickAdd(true)}
          onToggleMobileSidebar={toggleMobileSidebar}
        />

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Quick Add Modal */}
      <QuickAddModal
        isOpen={showQuickAdd}
        onClose={() => setShowQuickAdd(false)}
        onSave={handleQuickAddTask}
        lists={lists}
      />
    </div>
  );
};

export default Layout;