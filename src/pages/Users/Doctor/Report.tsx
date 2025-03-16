import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  addReport,
  getDoctorDetailsById,
  getUserData,
} from "../../../api/action/UserActionApi";
import { toast } from "react-toastify";

interface Doctor {
  _id: string;
  name: string;
  email: string;
  department: string;
  education: string;
  profilePicture: string;
}

interface UserData {
  _id: string;
}

const ReportDoctorForm = () => {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<Doctor>({} as Doctor);

  const [formData, setFormData] = useState({
    reportType: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [user, setUser] = useState<UserData>({
    _id: "",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userDataString = localStorage.getItem("user");
        if (userDataString) {
          const user = JSON.parse(userDataString);
          const email = user?.email;
          console.log("user Email:", email);

          if (email) {
            const response = await getUserData(email);
            console.log("users list:", response);
            setUser(response);
          }
        } else {
          console.log("No user data found in localStorage");
        }
      } catch (error) {
        console.log("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const doctorId = decodeURI(location.pathname.split("/").pop() || "");
        const response = await getDoctorDetailsById(doctorId);
        console.log("Doctor Details:", response);
        setDoctor(response);
      } catch (error) {
        toast.error("Error fetching doctor details");
      }
    };

    fetchDoctors();
  }, []);

  // Report type options
  const reportTypes = [
    "Unprofessional Behavior",
    "Incorrect Medical Advice",
    "Appointment Issues",
    "Billing Problems",
    "Privacy Concerns",
    "Medication Errors",
    "Communication Issues",
    "Other",
  ];

  // Handle form field changes
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");


    console.log("data form" , formData.reportType , formData.description)

    // Check required fields
    if (!formData.reportType || !formData.description) {
      setError("Please fill out all required fields");
      setLoading(false);
      return;
    }

    try {

     
      const response = await addReport(
        doctor._id,
        user._id,
        formData.reportType,
        formData.description
      );

      if (response) {
        setSuccess(true);
        setLoading(false);

        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    } catch (err) {
      setError("Failed to submit report. Please try again.");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 py-6 px-4 mt-20">
        <div className="container mx-auto py-16 px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl p-8 border border-indigo-100">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 mx-auto rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mt-4">
                Report Submitted
              </h2>
              <p className="text-gray-600 mt-2">
                Thank you for your feedback. We will review your report and take
                appropriate action.
              </p>
              <p className="text-gray-600 mt-1">
                You will be redirected to the home shortly.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 py-6 px-4">
      <div className="container mx-auto py-6 px-4 mt-32">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-indigo-800">
            Report a Doctor
          </h1>
          <p className="text-gray-600 mt-2">
            Please provide details about your concern so we can address it
            properly.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-6 mb-6 border border-indigo-100">
          {/* Doctor Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-blue-700 mb-2">
              Doctor Information
            </h3>
            <div className="border border-blue-100 rounded-lg p-4 bg-blue-50 shadow-sm">
              {doctor && (
                <div className="grid grid-cols-2 gap-4">
                  <p>
                    <span className="font-medium">Name:</span> Dr. {doctor.name}
                  </p>
                  <p>
                    <span className="font-medium">Education:</span>{" "}
                    {doctor.education}
                  </p>
                  <p>
                    <span className="font-medium">Department:</span>{" "}
                    {doctor.department}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span> {doctor.email}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 001.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Report Form */}
          <form onSubmit={handleSubmit}>
            {/* Report Type */}
            <div className="mb-4">
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="reportType"
              >
                Type of Issue <span className="text-red-500">*</span>
              </label>
              <select
                id="reportType"
                name="reportType"
                value={formData.reportType}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select an issue type</option>
                {reportTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="mb-4">
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="description"
              >
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Please provide details about the issue..."
                required
              ></textarea>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Submit Report"
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-4 border-t border-dashed border-indigo-300">
            <div className="text-sm text-gray-500">
              <p className="mb-1">
                Your report will be reviewed by our medical team. Please note:
              </p>
              <ul className="list-disc ml-5 space-y-1">
                <li>All reports are kept confidential</li>
                <li>We may contact you for additional information</li>
                <li>
                  Serious concerns may be escalated to medical authorities
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mb-44"></div>
      </div>
    </div>
  );
};

export default ReportDoctorForm;
