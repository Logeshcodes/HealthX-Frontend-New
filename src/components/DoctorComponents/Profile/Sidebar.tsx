import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // Import useLocation for route matching

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  link: string;
}

interface SidebarProps {
  navItems: NavItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ navItems }) => {
  const location = useLocation();

  return (
    <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
      {navItems.map((item) => (
        <Link
          key={item.id}
          to={item.link}
          className={`flex items-center space-x-4 p-2 rounded-md hover:bg-gray-200 transition ${
            location.pathname === item.link ? 'bg-gray-200' : ''
          }`}
        >
          <item.icon size={20} className="text-gray-600" />
          <span className="text-sm text-gray-600">{item.label}</span>
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;
