import React, { useEffect, useState, useCallback } from 'react';
import { UserX, UserCheck , Search } from 'lucide-react';
import { getAllUser, blockUser } from '../../api/action/AdminActionApi';
import { toast } from 'react-toastify';

interface UserProps {
  isDarkMode: boolean;
}

interface User {
  id: string;
  username: string;
  email: string;
  status: 'Blocked' | 'Active';
  created: string;
}

const ITEMS_PER_PAGE = 5;

const UserList: React.FC<UserProps> = ({ isDarkMode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Blocked'>('All');

  useEffect(() => {
    const fetchUsers = async () => {
      const userData = await getAllUser();
      if (userData) {
        const formattedUsers = userData.map((user: any) => ({
          id: user._id,
          username: user.username || 'N/A',
          email: user.email,
          status: user.isBlocked ? 'Blocked' : 'Active',
          created: new Date(user.createdAt).toLocaleDateString('en-GB'),
        }));
        setUsers(formattedUsers);
      }
    };

    fetchUsers();
  }, []);

  const handleBlock = useCallback(
    async (email: string) => {
      try {
        const response = await blockUser(email);
        if (response.success) {
          toast.success(response.message);
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.email === email ? { ...user, status: user.status === 'Blocked' ? 'Active' : 'Blocked' } : user
            )
          );
        } else {
          toast.error(response.message);
        }
      } catch (error: any) {
        toast.error(error.message || 'Unknown Error Occurred!');
      }
    },
    []
  );

  // Filter and Search Logic
  const filteredUsers = users
    .filter((user) =>
      filterStatus === 'All' ? true : user.status === filterStatus
    )
    .filter((user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Pagination Logic
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className={`min-h-screen ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-500">User List</h1>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex justify-between items-center mb-4">
        <Search className="absolute  transform -translate-y-1/1 text-gray-400 p-1" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
             className="pl-10 bg-gray-800 border-gray-700 text-white w-full p-2 rounded-lg"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'All' | 'Active' | 'Blocked')}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-black rounded-lg
            hover:from-blue-600 hover:to-blue-700 transition-all duration-200 
            shadow-md hover:shadow-lg transform hover:-translate-y-0.5
            flex items-center gap-2 font-medium"
          >
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Blocked">Blocked</option>
          </select>
        </div>

        <div className={`rounded-lg overflow-hidden shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <table className="w-full">
            <thead>
              <tr className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <th className="px-6 py-4 text-left">S.No</th>
                <th className="px-6 py-4 text-left">Name</th>
                <th className="px-6 py-4 text-left">Email</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Created</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user, index) => (
                  <tr
                    key={user.id}
                    className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} transition-colors duration-150 hover:bg-opacity-50 ${
                      isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className="px-6 py-4">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                    <td className="px-6 py-4">{user.username}</td>
                    <td className="px-6 py-4">{user.email}</td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          user.status === 'Blocked'
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : 'bg-green-100 text-green-800 border border-green-200'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{user.created}</td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleBlock(user.email)}
                          className={`p-2 rounded-full transition-all duration-200 ${
                            user.status === 'Blocked'
                              ? 'bg-red-500 text-white-600 hover:bg-red-200'
                              : 'bg-green-500 text-white-600 hover:bg-green-200 '
                          } transform hover:scale-110`}
                          title={user.status === 'Blocked' ? 'Unblock User' : 'Block User'}
                        >
                          {user.status === 'Blocked' ? (
                            <UserX className="h-4 w-4" />
                          ) : (
                            <UserCheck className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center text-gray-500 py-4">
                    No Users are available
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center py-4 px-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserList;