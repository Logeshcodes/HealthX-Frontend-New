import React from 'react';
import {  Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { User, Lock, Shield, Edit2,  Cog , Info } from 'lucide-react';

const ProfileManagement: React.FC = () => {
 

  const navItems = [
    { id: 'myAccount', label: 'My Account', icon: User, link: '/user/profile/my-account' },
    { id: 'accountStatus', label: 'Account Status', icon: Shield, link: '/user/profile/account-status' },
    { id: 'editProfile', label: 'Edit Profile', icon: Edit2, link: '/user/profile/edit-profile' },
    { id: 'changePassword', label: 'Change Password', icon: Lock, link: '/user/profile/change-password' },
    { id: 'settings', label: 'Settings', icon: Cog, link: '/user/profile/settings' },
    { id: 'helpCenter', label: 'Help Center', icon: Info, link: '/user/profile/help-center' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-blue-500 text-white p-4 rounded-lg mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Settings</h1>
        <div className="text-sm">Dashboard / Settings</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Sidebar navItems={navItems}  />
        </div>

        <div className="lg:col-span-3">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ProfileManagement;
