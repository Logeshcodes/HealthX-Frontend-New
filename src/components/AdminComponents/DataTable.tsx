import React, { useCallback, useState } from "react";
import { Eye, UserCheck, UserRoundPen, UserX } from "lucide-react";
import { toast } from 'react-toastify';
import { blockDoctor } from "../../api/action/AdminActionApi";

interface IDoctor {
  name: string;
  department: string;
  Mobile: string;
  email: string;
  status: string;
  isBlocked : string ;
  consultationType: string;
}

interface DataTableProps {
  doctors: IDoctor[];
  isDarkMode: boolean;
  showActions: boolean;
  showVerify: boolean;
  setDoctors:Function

}

const DataTable: React.FC<DataTableProps> = ({
  doctors,
  showActions,
  showVerify,
  setDoctors
}) => {
  const ITEMS_PER_PAGE = 3;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredDoctors.length / ITEMS_PER_PAGE);
  const paginatedDoctors = filteredDoctors.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };





  const handleBlock = useCallback(
      async (email: string) => {
        try {
          const response = await blockDoctor(email);
          if (response.success) {
            toast.success(response.message);
            setDoctors((prevDoctors: IDoctor[]) =>
              prevDoctors.map((doctor : IDoctor) =>
                doctor.email === email
                  ? {
                      ...doctor,
                      status: doctor.status === "blocked" ? "approved" : "blocked", // toggle status
                      isBlocked: !doctor.isBlocked, // toggle isBlocked
                    }
                  : doctor
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
  

  return (
    <div className="w-full p-4 bg-slate-900 rounded-lg">
      <input
        type="text"
        placeholder="Search by name, specialization or email"
        className="w-full p-2 bg-slate-700 text-white rounded-lg mb-4"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="px-4 py-3 text-sm font-medium text-gray-200 text-left">
                S:No
              </th>
              <th className="px-4 py-3 text-sm font-medium text-gray-200 text-left">
                Doctor Name
              </th>
              <th className="px-4 py-3 text-sm font-medium text-gray-200 text-left">
                Mobile Number
              </th>
              <th className="px-4 py-3 text-sm font-medium text-gray-200 text-left">
                Email
              </th>
              <th className="px-4 py-3 text-sm font-medium text-gray-200 text-left">
                Status
              </th>
              <th className="px-4 py-3 text-sm font-medium text-gray-200 text-left">
                Mode
              </th>
              {showActions && (
                <th className="px-4 py-3 text-sm font-medium text-gray-200 text-left">
                  Action
                </th>
              )}
              {showVerify && (
                <th className="px-4 py-3 text-sm font-medium text-gray-200 text-left">
                  Action
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedDoctors.map((doctor, index) => (
              <tr
                key={index}
                className="border-t border-gray-700 hover:bg-gray-700"
              >
                <td className="px-4 py-4 text-sm text-gray-300">
                  {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src="../../../profile.jpg"
                      alt="doctor"
                      className="w-12 h-12 bg-gray-300 rounded-full"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-200">
                        {doctor.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {doctor.department}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-300">
                  {doctor.Mobile}
                </td>
                <td className="px-4 py-4 text-sm text-gray-300">
                  {doctor.email}
                </td>

                <td className="px-4 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      doctor.status === "approved"
                        ? "bg-green-200 text-green-600"
                        : doctor.status === "rejected"
                        ? "bg-red-200 text-red-600"
                        : doctor.status === "pending"
                        ? "bg-yellow-200 text-yellow-600"
                        : doctor.status === "blocked"
                        ? "bg-red-200 text-red-600"
                        : doctor.status === "registered"
                        ? "bg-blue-200 text-blue-600"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {doctor.status.charAt(0).toUpperCase() +
                      doctor.status.slice(1)}
                  </span>
                </td>

                <td className="px-4 py-4">
                  <span
                    className={`text-sm ${
                      doctor.consultationType === "online"
                        ? "text-blue-400"
                        : "text-gray-400"
                    }`}
                  >
                    {doctor.consultationType.charAt(0).toUpperCase() +
                      doctor.consultationType.slice(1)}
                  </span>
                </td>

                {showVerify && (
                  <td className="px-4 py-4">
                    <div className="flex gap-2">

                      
                      <button
                        className="p-2 text-blue-400 hover:text-blue-300 transform hover:scale-110"
                        title="View Documents"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleBlock(doctor.email)}
                          className={`p-2 rounded-full transition-all duration-200 ${
                            doctor.status === "blocked"
                              ? "bg-red-500 text-white-600 hover:bg-red-200"
                              : "bg-green-500 text-white-600 hover:bg-green-200 "
                          } transform hover:scale-110`}
                          title={
                            doctor.status === "blocked"
                              ? "Unblock User"
                              : "Block User"
                          }
                        >
                          {doctor.isBlocked === "true" ? (
                            <UserX className="h-4 w-4" />
                          ) : (
                            <UserCheck className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </td>
                )}

                {showActions && (
                  <td className="px-4 py-4">
                    <div className="flex gap-2">

                    {doctor.status !== "registered" && (
                      <a href={`/admin/documentVerification/${doctor.email}`}>
                      <button
                        className="p-2 text-blue-400 hover:text-blue-300 transform hover:scale-110"
                        title="View Documents"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      </a>
                      )}


                      {doctor.status === "registered" && (
                        <button className="p-2 text-blue-400 hover:text-blue-300 transform hover:scale-110" title="Verify Doctor">
                          <UserRoundPen size={16} />
                        </button>
                      )}
                      {doctor.status === "pending" && (
                        <button className="p-2 text-yellow-400 hover:text-yellow-300 transform hover:scale-110" title="Verify Doctor">
                          <UserRoundPen size={16} />
                        </button>
                      )}
                      {doctor.status === "rejected" && (
                        <button className="p-2 text-red-400 hover:text-red-300 transform hover:scale-110" title="Rejected Doctor">
                          <UserRoundPen size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center py-4 px-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DataTable;
