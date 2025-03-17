import React from 'react';
import {  Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { User, Lock, Shield, Edit2, BadgeCheck , Wallet } from 'lucide-react';

const ProfileManagement: React.FC = () => {
  

  const navItems = [
    { id: 'myAccount', label: 'My Account', icon: User, link: '/doctor/profile/my-account' },
    { id: 'accountStatus', label: 'Account Status', icon: Shield, link: '/doctor/profile/account-status' },
    { id: 'wallet', label: 'Wallet', icon: Wallet, link: '/doctor/profile/wallet' },
    { id: 'editProfile', label: 'Edit Profile', icon: Edit2, link: '/doctor/profile/edit-profile' },
    { id: 'verifyProfile', label: 'Verify Profile', icon: BadgeCheck, link: '/doctor/profile/verify-profile' },
    { id: 'changePassword', label: 'Change Password', icon: Lock, link: '/doctor/profile/change-password' },
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
