import { Outlet } from "react-router-dom";
import AdminHeader from "../components/AdminComponents/AdminHeader";
import AdminSidebar from "../components/AdminComponents/AdminSideBar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Layout, UserCheck, Users, Warehouse, CircleUserIcon, LogOut , Dock, MessageCircleWarning } from "lucide-react";

import { adminLogout } from "../api/auth/AdminAuthentication";

const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true); 
  const [isDarkMode, setDarkMode] = useState(true); 
  const [activeTab, setActiveTab] = useState(""); 
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const toggleTheme = () => setDarkMode(!isDarkMode);

  const handleLogout = async() => {
    try {
      const response = await adminLogout();
      localStorage.removeItem("admin");
      toast.success(response.message);
      navigate("/admin/login");
      
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Failed to log out. Please try again.");
    }
    
  };

 
const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: Layout, href: "/admin/dashboard" },
  // { id: "sample", label: "Sample", icon: Layout, href: "/admin/sample" },
  { id: "verifiedDoctors", label: "Verified Doctors", icon: UserCheck, href: "/admin/verifiedDoctors" },
  { id: "requestedDoctors", label: "Requested Doctors", icon: Users, href: "/admin/requestedDoctors" },
  { id: "departments", label: "Departments", icon: Warehouse, href: "/admin/department" },
  { id: "users", label: "Users", icon: CircleUserIcon, href: "/admin/users" },
  { id: "banners", label: "Banners", icon: Dock, href: "/admin/banners" },
  { id: "reports", label: "Reports", icon: MessageCircleWarning, href: "/admin/reports" },
  { id: "logout", label: "Logout", icon: LogOut, action: () => handleLogout() },
];


  const handleNavigation = (href: string, id: string) => {
    if (id === "logout") {
      handleLogout();
    } else {
      setActiveTab(id); 
      if (href) navigate(href);
    }
  };
  

  return (
    <div className={`h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <div className="flex h-full">
        {/* Sidebar */}
        <AdminSidebar
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          isDarkMode={isDarkMode}
          sidebarItems={sidebarItems}
          activeTab={activeTab} 
          handleNavigation={handleNavigation} 
        />

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-auto">
          <AdminHeader isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
          <Outlet context={{ isDarkMode }} />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
