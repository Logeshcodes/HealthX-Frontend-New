import { Menu } from "lucide-react";

const AdminSidebar = ({ isSidebarOpen, toggleSidebar, isDarkMode, sidebarItems, activeTab, handleNavigation }: any) => {
  return (
    <div
      className={`
        ${isSidebarOpen ? "w-64" : "w-20"}
        ${isDarkMode ? "bg-gray-800" : "bg-white"}
        transition-all duration-300 p-4 shadow-lg
      `}
    >
      <div className="flex items-center justify-between mb-8">
        <h1 className={`font-bold ${!isSidebarOpen && "hidden"}`}>Health X</h1>
        <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-gray-700">
          <Menu size={20} />
        </button>
      </div>

      <nav className="space-y-2">
        {sidebarItems.map((item: any) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.href) {
                  handleNavigation(item.href, item.id); // Pass href and id to handleNavigation
                } else {
                  item.action && item.action(); // Execute action (logout) if provided
                }
              }}
              className={`
                w-full flex items-center gap-4 p-3 rounded-lg
                ${activeTab === item.id ? (isDarkMode ? "bg-blue-600" : "bg-blue-100") : "hover:bg-gray-700"}
              `}
            >
              <Icon size={20} />
              {isSidebarOpen && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default AdminSidebar;
