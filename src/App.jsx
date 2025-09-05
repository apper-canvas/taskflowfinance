import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/Layout";
import AllTasksPage from "@/components/pages/AllTasksPage";
import TodayPage from "@/components/pages/TodayPage";
import UpcomingPage from "@/components/pages/UpcomingPage";
import ListPage from "@/components/pages/ListPage";

function App() {
  return (
    <BrowserRouter>
      <div className="font-body">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<AllTasksPage />} />
            <Route path="today" element={<TodayPage />} />
            <Route path="upcoming" element={<UpcomingPage />} />
            <Route path="list/:listId" element={<ListPage />} />
          </Route>
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          className="z-[9999]"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;