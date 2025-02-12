import React, { useEffect, useState } from 'react';
import { Pencil, Plus, Search } from 'lucide-react';
import { getAllDepartment } from '../../api/action/AdminActionApi';
import { debounce } from 'lodash';

interface DepartmentProps {
  isDarkMode: boolean;
}

interface Department {
  _id: string;
  departmentName: string;
  isListed: boolean;
  createdAt: string;
}

const ITEMS_PER_PAGE = 5;

const Department: React.FC<DepartmentProps> = ({ isDarkMode }) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchDepartments = async () => {
      setLoading(true);
      try {
        const response = await getAllDepartment();
        setDepartments(response.data.departments || []);
        setFilteredDepartments(response.data.departments || []);
      } catch (error) {
        console.error('Error fetching departments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  // Debounced search handler
  const handleSearch = debounce((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    if (query.trim() === '') {
      setFilteredDepartments(departments);
    } else {
      const filtered = departments.filter(dept =>
        dept.departmentName.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredDepartments(filtered);
    }
  }, 300);

  // Pagination Logic
  const totalPages = Math.ceil(filteredDepartments.length / ITEMS_PER_PAGE);
  const paginatedDepartments = filteredDepartments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className={`min-h-screen ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-500">Departments List</h1>

          {/* Add More button */}
          <a href="/admin/addDepartment">
            <button
              className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg
              hover:from-blue-600 hover:to-blue-700 transition-all duration-200 
              shadow-md hover:shadow-lg transform hover:-translate-y-0.5
              flex items-center gap-2 font-medium"
            >
              <Plus className="h-4 w-4" />
              Add More
            </button>
          </a>
        </div>

        <div className="mb-6 ">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white w-full p-2 rounded-lg"
            />
          </div>
        </div>

        <div className={`rounded-lg overflow-hidden shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <table className="w-full">
            <thead>
              <tr className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <th className="px-6 py-4 text-left">S.No</th>
                <th className="px-6 py-4 text-left">Name</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Created At</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center text-gray-500 py-4">
                    Loading departments...
                  </td>
                </tr>
              ) : paginatedDepartments.length > 0 ? (
                paginatedDepartments.map((dept, index) => (
                  <tr
                    key={dept._id}
                    className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} transition-colors duration-150 hover:bg-opacity-50 ${
                      isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className="px-6 py-4">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                    <td className="px-6 py-4">{dept.departmentName}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          dept.isListed
                            ? 'bg-green-100 text-green-800 border border-green-200'
                            : 'bg-red-100 text-red-800 border border-red-200'
                        }`}
                      >
                        {dept.isListed ? 'Listed' : 'Unlisted'}
                      </span>
                    </td>
                    <td className="px-6 py-4">{new Date(dept.createdAt).toLocaleDateString('en-GB')}</td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-3">
                        <button
                          className={`p-2 rounded-full transition-all duration-200 ${
                            isDarkMode
                              ? 'hover:bg-blue-500 hover:bg-opacity-20 text-blue-400 hover:text-blue-300'
                              : 'hover:bg-blue-100 text-blue-600 hover:text-blue-700'
                          } transform hover:scale-110`}
                          title="Edit Department"
                        >
                          <a href={`/admin/editDepartment/${dept.departmentName}`}>
                            <Pencil className="h-4 w-4" />
                          </a>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center text-gray-500 py-4">
                    No departments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center py-4 px-6">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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

export default Department;
