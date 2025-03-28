import { useEffect, useState } from "react";
import {Calendar,Clock,MapPin,FileText,
  Video,
  CheckCircle2,
  CircleX,
  Ban,
} from "lucide-react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);
import {
  CardContent,
  Card,
} from "../../../components/Common/card/Card2";
import { Button } from "../../../components/Common/button/Button2";
import { getAllAppointmentDetails , appointmentCancel, getUserData } from "../../../api/action/UserActionApi";
import { logout } from "../../../api/auth/UserAuthentication";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { clearUserDetails } from "../../../redux/slices/userSlice";
import VideoCallModal from "../../../components/Common/VideoCall/createCall";
import useVideoCall from "../../../components/Common/VideoCall/useVideoCall";


import AlertDialog2 from "../../../components/UserComponents/common/AlertDialogBox2";
import LoadingSpinner from "../../../components/AdminComponents/LoadingSpinner";

interface UserData {
  email : string ;
  username: string;
  profilePicture: string;
}

interface Appointment {
  _id?: string ;
  slotId: string;
  paymentId: string;
  doctorId: string;
  amount: number;
  prescriptionStatus : Boolean;
  paymentStatus: string;
  patientId: string;
  doctorEmail: string;
  doctorName: string;
  profilePicture: string;
  appointmentTime: string;
  department: string;
  mode: string;
  location: string;
  status: string;
  patientEmail: string;
}

const AppointmentDashboard = () => {
  console.log("compound is rendering....");
  const [activeTab, setActiveTab] = useState("upcoming");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
 
  const [currentPage, setCurrentPage] = useState(1);
  const [totalAppointments, setTotalAppointments] = useState(0);

  const [loader, setLoader] = useState(false);

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

  const handlePrescription = (appointmentId : string) => {
    navigate(`/user/prescription/${appointmentId}`);
  };

  const handleCancel = async (appointmentId : string) =>{

      try {

        const response =  await appointmentCancel(appointmentId);

        if (response.success) {
        
          toast.success(response.message);
          setAppointments((prevAppointment) => prevAppointment.filter((appointment) => appointment._id !== appointmentId))
        } else {
          toast.success(response.message || "Failed to Cancel Requested");
        }
        
      } catch (error) {
          console.error(error);
          toast.error("An unexpected error occurred");
      }
  }

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const userDataString = localStorage.getItem("user");

        if (userDataString) {
          const user = JSON.parse(userDataString);
          const userId = user?.userId;

          if (userId) {
            setLoader(true);
            console.log("Fetching data for:", userId, currentPage, activeTab);

            const response = await getAllAppointmentDetails(
              userId,
              currentPage,
              slotsPerPage,
              activeTab
            );

            console.log("Fetched Appointments:", response);

            setAppointments(response.data);
            setTotalAppointments(response.total);

            setTodayCount(response.todayCount);
            setCompletedCount(response.completedCount);
            setTotalEarnings(response.totalEarnings);
          }
        }
      } catch (error: any) {
        console.log("Error fetching appointments:", error.response?.status);
        if (error.response?.status === 401) await handleLogout();
      }finally {
        setLoader(false);
      }
    };

    fetchAppointments();
  }, [currentPage, activeTab]);


  const [users, setUsers] = useState<UserData>({
    email :"",
    username: "",
    profilePicture: "",
  });

   useEffect(() => {
      const fetchUsers = async () => {
        try {
          const userDataString = localStorage.getItem('user');
          if (userDataString) {
            const user = JSON.parse(userDataString);
            const email = user?.email;
  
            if (email) {
              const data = await getUserData(email);
              setUsers(data);
            }
          } 
        } catch (error) {
          console.error('Error fetching user data:', error);
        } 
      };
  
      fetchUsers();
    }, []);

  const totalPages = Math.ceil(totalAppointments / slotsPerPage) ;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "booked":
        return "bg-green-600 text-green-800";
      case "completed":
        return "bg-yellow-600 text-yellow-800";
      case "cancelled":
        return "bg-red-600 text-red-800";
      
      default:
        return "bg-gray-700 text-gray-800";
    }
  };

  return (

    <>

   
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 mt-36">
      {/* Header Section */}
      
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center">
                  <img
                    src={
                      users?.profilePicture ||
                      "/api/placeholder/96/96"
                    }
                    alt="Patient"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {users?.username}
                  </h1>
                  <p className="text-gray-500">
                    {users?.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      

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
                  <p className="text-sm opacity-80">Total Spending</p>
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

      {loader ? (
      <LoadingSpinner />
    ) : (

      <>

      {/* Appointments List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {appointments.length > 0 ? (
            appointments.map((appointment: any) => (
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
                          {appointment?.slotDetails?.day && (
                            <>
                              {`${appointment.slotDetails.day}, `}
                              {appointment?.slotDetails?.date && new Date(appointment.slotDetails.date).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                              })}
                            </>
                          )}
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


                      {appointment.status === "booked" ? (
                        <div>
                          {!appointment.prescriptionStatus && (
                            <Button className={`${getStatusColor(appointment.status)} text-white`}>
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </Button>
                          )}

                          <AlertDialog2
                            title="Confirm Cancellation"
                            alert={`Canceling will deduct 20% from your payment.

                            Are you sure you want to proceed?`}
                            onConfirm={() => handleCancel(appointment._id)}
                          >
                            <Button className="bg-red-600 hover:bg-red-700 text-white ml-2">
                              Cancel
                            </Button>
                          </AlertDialog2>
                        </div>
                      ) : appointment.status === "completed" ? (
                        
                        <div>
                          <Button className={`${getStatusColor(appointment.status)} text-white`}>
                            {/* <CircleCheck className="w-6 h-6 mr-2" /> */}
                            Done
                          </Button>

                          {appointment.prescriptionStatus && (
                            <Button
                              onClick={() => handlePrescription(appointment?._id)}
                              className={`${getStatusColor(appointment.status)} text-white ml-2`}
                            >
                              Prescription
                            </Button>
                          )}
                        </div>
                      ) : appointment.status === "cancelled" ? (
                        <Button className={`${getStatusColor(appointment.status)} text-white`}>
                          <CircleX className="w-6 h-6 mr-2" />
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </Button>
                      ) : (
                        <div>
                          <Button className={`${getStatusColor(appointment.status)} text-white`}>
                            <Ban className="w-6 h-6 mr-2" />
                            Approve
                          </Button>
                        </div>
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
      </>

    )}






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
   
  </> 
  );
};

export default AppointmentDashboard;
