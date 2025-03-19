import { useEffect, useState } from "react";
import { Search, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import DoctorCard from "../../../components/Common/card/DoctorCard";
import { getDoctorData } from "../../../api/action/UserActionApi";
import { getDepartmentData } from "../../../api/action/UserActionApi";

interface Department {
  departmentName: string;
}

interface Doctor {
  _id: string;
  name: string;
  department: string;
  experience: number;
  education: string;
  description: string;
  consultationType: string;
  consultationFee : number ;
  profilePicture: string;

}

const DoctorListingPage = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  const [selectedDepartment, setSelectedDepartment] = useState<string>("All Department");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const doctorsPerPage = 5;

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await getDoctorData();
        setDoctors(data.users || []);
        setFilteredDoctors(data.users || []);

         
      } catch (error) {
        console.log("Error fetching doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);




  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await getDepartmentData();
        setDepartments([{ departmentName: "All Department" }, ...response.departments]);
      } catch (error) {
        console.log("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    filterDoctors();
  }, [searchTerm, selectedDepartment]);

  const filterDoctors = () => {
    let filtered = doctors;
  
    if (searchTerm) {
      filtered = filtered.filter((doctor) =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  
    if (selectedDepartment !== "All Department") {
      filtered = filtered.filter(
        (doctor) =>
          doctor.department?.toLowerCase().trim() ===
          selectedDepartment.toLowerCase().trim()
      );
    }
  
    setFilteredDoctors(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Calculate pagination
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);
  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedDepartment("All Department");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 pt-36">
        {/* Stats */}
        <div className="mb-8">
          <h1 className="text-xl md:text-2xl font-semibold mb-2">
            {filteredDoctors?.length || 0} doctors are ready to serve you
          </h1>
          <p className="text-gray-600 flex items-center gap-2 text-sm md:text-base">
            <span className="w-4 h-4 rounded-full bg-green-500 inline-block"></span>
            Book appointments with minimum wait-time & verified doctor details
          </p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <div className="relative col-span-3">
            <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by doctor name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          <div className="relative">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {departments.map((dept, index) => (
                <option value={dept.departmentName} key={index}>
                  {dept.departmentName}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-3 text-gray-400 w-5 h-5 pointer-events-none" />
          </div>

          <button
            onClick={clearFilters}
            disabled={!searchTerm && selectedDepartment === "All Department"}
            className={`px-6 py-2 text-white rounded-lg transition-colors ${
              searchTerm || selectedDepartment !== "All Department"
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-400 cursor-not-allowed"
            }`}
          >
            Clear Filter
          </button>

        </div>

        {/* Doctor Cards */}
        <div className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                  <div className="flex gap-6">
                    <div className="w-24 h-24 rounded-full bg-gray-200"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : currentDoctors.length > 0 ? (
            <>
              {currentDoctors.map((doctor: any) => (
                <div
                  key={doctor.email}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <DoctorCard doctor={doctor}  />
                </div>
              ))}
              
              {/* Pagination Controls */}
              <div className="flex justify-between items-center mt-6 border-t pt-4">
                <p className="text-sm text-gray-600">
                  Showing {indexOfFirstDoctor + 1} to {Math.min(indexOfLastDoctor, filteredDoctors.length)} of {filteredDoctors.length} doctors
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`p-2 rounded ${currentPage === 1 ? 'text-gray-400' : 'text-blue-600 hover:bg-blue-50'}`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 rounded ${
                        currentPage === i + 1
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 hover:bg-blue-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded ${currentPage === totalPages ? 'text-gray-400' : 'text-blue-600 hover:bg-blue-50'}`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No doctors found matching your criteria.</p>
              <button
                onClick={clearFilters}
                className="mt-4 text-blue-600 hover:text-blue-700"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DoctorListingPage;
