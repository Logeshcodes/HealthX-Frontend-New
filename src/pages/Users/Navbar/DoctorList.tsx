import { useEffect, useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import DoctorCard from "../../../components/Common/card/DoctorCard";
import { getDoctorData } from "../../../api/action/UserActionApi";
import { getDepartmentData } from "../../../api/action/UserActionApi";

interface Department {
  departmentName: string;
}

const DoctorListingPage = () => {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("All Department");
  const [departments, setDepartments] = useState<Department[]>([]);

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
  };
  

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
            <div>Loading...</div>
          ) : filteredDoctors && filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor: any) => (
              <div
                key={doctor.email}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <DoctorCard doctor={doctor} />
              </div>
            ))
          ) : (
            <div>No doctors available.</div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DoctorListingPage;
