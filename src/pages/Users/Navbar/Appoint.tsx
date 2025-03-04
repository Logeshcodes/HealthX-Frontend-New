import { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  FileText,
  Video,
  CheckCircle2,
} from "lucide-react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);
import {
  CardContent,
  Card,
} from "../../../components/DoctorComponents/Appointments/card";
import { Button } from "../../../components/DoctorComponents/Appointments/button";
import { getAllAppointmentDetails } from "../../../api/action/UserActionApi";
import { logout } from "../../../api/auth/UserAuthentication";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { clearUserDetails } from "../../../redux/slices/userSlice";
import VideoCallModal from "../../../components/Common/VideoCall/createCall";
import useVideoCall from "../../../components/Common/VideoCall/useVideoCall";

interface PatientDetails {
  _id?: string | undefined;
  username: string;
  email: string;
  profilePicture: string;
}

interface Appointment {
  slotId: string;
  paymentId: string;
  doctorId: string;
  amount: number;
  paymentStatus: string;
  patientId: string;
  doctorEmail: string;
  doctorName: string;
  profilePicture: string;
  appointmentTime: string;
  appointmentDate: string;
  department: string;
  mode: string;
  location: string;
  status: string;
  patientEmail: string;
  patientDetails?: PatientDetails;
}

const AppointmentDashboard = () => {
  console.log("compound is rendering....");
  const [activeTab, setActiveTab] = useState("upcoming");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<
    Appointment[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalAppointments, setTotalAppointments] = useState(0);

  const { showVideoCallModal, sender, handleCall, closeModal } = useVideoCall();

  const slotsPerPage = 5;

  const [todayCount, setTodayCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await logout();
      dispatch(clearUserDetails());
      navigate("/user/login");
    } catch (error: any) {
      console.error("Error during logout:", error);
      toast.error("Failed to log out. Please try again.");
    }
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const userDataString = localStorage.getItem("user");

        if (userDataString) {
          const user = JSON.parse(userDataString);
          const userId = user?.userId;

          if (userId) {
            console.log("Fetching data for:", userId, currentPage, activeTab);

            const response = await getAllAppointmentDetails(
              userId,
              currentPage,
              slotsPerPage,
              activeTab
            );

            console.log("Fetched Appointments:", response.data);

            setAppointments(response.data);
            setFilteredAppointments(response.data);
            setTotalAppointments(response.total);

            setTodayCount(response.todayCount);
            setCompletedCount(response.completedCount);
            setTotalEarnings(response.totalEarnings);
          }
        }
      } catch (error: any) {
        console.log("Error fetching appointments:", error.response?.status);
        if (error.response?.status === 401) await handleLogout();
      }
    };

    fetchAppointments();
  }, [currentPage, activeTab]);

  const totalPages = Math.ceil(totalAppointments / slotsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 mt-36">
      {/* Header Section */}
      {appointments.slice(0, 1).map((appointment) => (
        <div
          className="bg-white shadow-sm border-b"
          key={appointment.paymentId}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center">
                  <img
                    src={
                      appointment?.patientDetails?.profilePicture ||
                      "/api/placeholder/96/96"
                    }
                    alt="Doctor"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {appointment?.patientDetails?.username}
                  </h1>
                  <p className="text-gray-500">
                    {appointment?.patientDetails?.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">Upcoming Appointments</p>
                  <p className="text-3xl font-bold mt-2">{todayCount}</p>
                </div>
                <Calendar className="w-8 h-8 opacity-80" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">Completed Appointments</p>
                  <p className="text-3xl font-bold mt-2">{completedCount}</p>
                </div>
                <CheckCircle2 className="w-8 h-8 opacity-80" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">Total Earnings</p>
                  <p className="text-3xl font-bold mt-2">₹{totalEarnings}</p>
                </div>
                <FileText className="w-8 h-8 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-6 border-b border-gray-200">
          {["upcoming", "past", "cancelled"].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === tab
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment: any) => (
              <Card
                key={appointment._id}
                className="hover:shadow-lg transition-shadow duration-200"
              >
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Doctor Info */}
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <img
                          src={appointment?.doctorDetails?.profilePicture}
                          alt="Doctor"
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {appointment?.doctorDetails?.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {appointment?.doctorDetails?.department}
                        </p>
                      </div>
                    </div>

                    {/* Date & Time */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">
                          {new Date(
                            appointment.appointmentDate
                          ).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">
                          {appointment?.slotDetails?.timeSlot}
                        </span>
                      </div>
                    </div>

                    {/* Location & Mode */}
                    <div className="space-y-2">
                      {appointment?.slotDetails?.mode === "Offline" ? (
                        <div className="flex items-center space-x-2 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">
                            {appointment?.doctorDetails?.location}
                          </span>
                        </div>
                      ) : (
                        <div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ml-6 font-medium ${
                              appointment.slotDetails?.mode === "Online"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {appointment.slotDetails?.mode}
                          </span>

                          <Button
                            onClick={() => {
                              console.log(
                                "Video Call Button Clicked - Patient Side"
                              );
                              handleCall(appointment?.doctorDetails?.email);
                            }}
                            className="bg-blue-600 hover:bg-blue-700 m-5 text-white"
                          >
                            <Video className="w-6 h-6 m-2" />
                            Join Call
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end space-x-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Amount</p>
                        <p className="font-medium text-gray-900">
                          ₹{appointment.amount}
                        </p>
                      </div>

                      {appointment.status === "Booked" ? (
                        <div>
                          <Button
                            className={`${getStatusColor(
                              appointment.status
                            )} text-white`}
                          >
                            {appointment.status.charAt(0).toUpperCase() +
                              appointment.status.slice(1)}
                          </Button>
                          <Button className="bg-red-600 hover:bg-red-700 text-white ml-2">
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          className={`${getStatusColor(
                            appointment.status
                          )} text-white`}
                        >
                          {appointment.status.charAt(0).toUpperCase() +
                            appointment.status.slice(1)}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center text-gray-500">
              {activeTab === "past" && "No Past Appointments"}
              {activeTab === "cancelled" && "No Cancelled Appointments"}
              {activeTab === "upcoming" && "No Upcoming Appointments"}
            </div>
          )}
        </div>
      </div>

      {/* Video Call Modal */}
      {showVideoCallModal && (
        <VideoCallModal
          to={sender}
          isOpen={showVideoCallModal}
          onClose={closeModal}
        />
      )}

      {/* Action Button */}
      <div className="fixed bottom-8 right-8">
        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg">
          <Calendar className="w-6 h-6" />
        </Button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default AppointmentDashboard;
