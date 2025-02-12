import { Sun, Moon } from "lucide-react";

const AdminHeader = ({ isDarkMode, toggleTheme }: any) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-2xl font-bold">Admin Management</h2>
      <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-gray-700">
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </div>
  );
};

export default AdminHeader;
