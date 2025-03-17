import React, { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { UserCheck, UserX } from "lucide-react";
import { toast } from "react-toastify";

import { blockDoctor, getAllDoctors, getAllReports, getAllUser } from '../../api/action/AdminActionApi';

interface Report {
  _id: string;
  doctorId: {
    _id: string;
    name: string;
    specialization: string;
    email: string;
    phoneNumber: string;
    isBlocked: boolean;
  };
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  reportType: string;
  description: string;
  createdAt: string;
}

interface User {
  id: string;
  username: string;
  email: string;
}

interface Doctor {
  _id: string;
  name: string;
  email: string | undefined;
  department: string;
  profilePicture: string;
  isBlocked: boolean;
  status: string;
}

const ReportManagement: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    try {
      const showUsers = async () => {
        const response = await getAllUser();
        console.log(response, "All Users");
        setUsers(response);
      };
      showUsers();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  useEffect(() => {
    try {
      const showDoctors = async () => {
        const response = await getAllDoctors();
        console.log(response, "All Docters");
        setDoctors(response);
      };
      showDoctors();
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [currentPage]);

  const reportPerPage = 1;

  const fetchReports = async () => {
    try {
      setLoading(true);

      const response = await getAllReports(
        currentPage,
        reportPerPage,
        searchTerm
      );
      setReports(response.data);
      setTotalPages(response.totalPages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching reports:", error);
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchReports();
  };

  const handleBlock = useCallback(async (email: string) => {
    try {
      const response = await blockDoctor(email);
      if (response.success) {
        toast.success(response.message);
        setDoctors((prevDoctors: Doctor[]) =>
          prevDoctors.map((doctor: Doctor) =>
            doctor.email === email
              ? {
                  ...doctor,
                  status: doctor.status === "blocked" ? "approved" : "blocked",
                  isBlocked: !doctor.isBlocked,
                }
              : doctor
          )
        );
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Unknown Error Occurred!");
    }
  }, []);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd-MM-yyyy HH:mm");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white mt-20">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Report Management</h1>
          <button
            onClick={() => setSearchTerm("")}
            className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition"
          >
            Clear Filters
          </button>
        </div>

        <form onSubmit={handleSearchSubmit} className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by report type"
              className="w-full p-3 pl-10 rounded-md bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none"
              value={searchTerm}
              onChange={handleSearch}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
          </div>
        </form>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-400">No reports found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    S.No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Doctor Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Patient Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Report Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {reports.map((report, index) => {
                  const doctor = doctors.find(
                    (doc: any) => doc._id === report.doctorId
                  );
                  const user = users.find(
                    (doc: any) => doc._id === report.userId
                  );

                  return (
                    <tr
                      key={report._id}
                      className="hover:bg-gray-700 transition"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        {(currentPage - 1) * reportPerPage + index + 1}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center ">
                          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden m-4">
                            <img
                              src={
                                doctor?.profilePicture || "/default-avatar.png"
                              }
                              alt="Profile"
                              className="max-w-12 h-12 rounded-full object-cover"
                              onError={(e) =>
                                (e.currentTarget.src = "/default-avatar.png")
                              }
                            />
                          </div>
                          <div>
                            <p className="font-medium">
                              {doctor?.name} ({doctor?.department || "N/A"})
                            </p>
                            <p className="text-xs text-gray-500">
                              {doctor?.email || "N/A"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium">
                          {user?.username || "Unknown"}
                        </p>
                        <p className="text-sm text-gray-400">
                          {user?.email || "N/A"}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            report.reportType === "Inappropriate Behavior"
                              ? "bg-red-900 text-red-200"
                              : report.reportType === "Misdiagnosis"
                              ? "bg-yellow-900 text-yellow-200"
                              : "bg-purple-900 text-purple-200"
                          }`}
                        >
                          {report.reportType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="max-w-xs truncate">
                          {report.description}
                        </p>
                        <button className="text-xs text-blue-400 hover:text-blue-300 mt-1">
                          Read more
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {formatDate(report.createdAt)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleBlock(doctor?.email ?? "")}
                              className={`p-2 rounded-full transition-all duration-200 ${
                                doctor?.status === "blocked"
                                  ? "bg-red-500 text-white-600 hover:bg-red-200"
                                  : "bg-green-500 text-white-600 hover:bg-green-200 "
                              } transform hover:scale-110`}
                              title={
                                doctor?.status === "blocked"
                                  ? "Unblock User"
                                  : "Block User"
                              }
                            >
                              {doctor?.isBlocked === true ? (
                                <UserX className="h-4 w-4" />
                              ) : (
                                <UserCheck className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md ${
              currentPage === 1
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-gray-700 hover:bg-gray-600 transition"
            }`}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))
            }
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md ${
              currentPage === totalPages
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-gray-700 hover:bg-gray-600 transition"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportManagement;
