import  { useEffect, useState } from 'react';
import { Calendar, Clock,  FileText, CheckCircle2, Video,MapPin, TicketCheck, CircleX, CircleCheck, Ban} from 'lucide-react';
import { CardContent , Card } from '../../../components/Common/card/Card2';
import { Button } from '../../../components/Common/button/Button2';
import { getAllDoctorAppointmentDetails , getDoctorData } from '../../../api/action/DoctorActionApi';
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc"; 
import timezone from "dayjs/plugin/timezone";

import VideoCallModal from '../../../components/Common/VideoCall/createCall';
import useVideoCall from '../../../components/Common/VideoCall/useVideoCall';
import { useNavigate } from 'react-router-dom';





dayjs.extend(utc);
dayjs.extend(timezone);

interface PatientDetails {
  _id?: string |  undefined;
  username: string;
  email: string;
  profilePicture: string;
}


interface SlotDetails {
  _id: string;
  mode: string;
  day : string ;
  date : string ;
  timeSlot: string;
}

interface Appointment {
  _id: string;
  paymentId: string;
  doctorId: string;
  doctorEmail: string;
  doctorName: string;
  profilePicture: string;
  prescriptionStatus : Boolean;
  amount: number;
  paymentStatus: string;
  appointmentTime: string;
  department: string;
  mode: string;
  status: string;
  patientEmail: string;
  patientDetails?: PatientDetails;
  slotDetails?: SlotDetails;
}

interface Doctor{
  profilePicture : string ;
  name : string ;
  department : string ;
  location : string ;
  email : string ;
}

const DoctorAppointmentDashboard = () => {
  const [activeTab, setActiveTab] = useState('upcoming'); 
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const slotsPerPage = 5;

  const [doctor , setDoctor] = useState<Doctor>()

  const [todayCount, setTodayCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);


  const { showVideoCallModal, sender, handleCall, closeModal } = useVideoCall();

  const navigate = useNavigate();

  const handleAddPrescription = (appointmentId : string) => {
    navigate(`/doctor/prescription/${appointmentId}`);
  };

  const handlePrescription = (appointmentId : string) => {
    navigate(`/doctor/viewPrescription/${appointmentId}`);
  };


  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const userDataString = localStorage.getItem('doctor');
        if (userDataString) {
          const user = JSON.parse(userDataString);
          const email = user?.email;
  
          const response = await getDoctorData(email);
  
          setDoctor(response);
     
        }
      } catch (error) {
        console.log('Error fetching doctor data:', error);
      }
    };
  
    fetchDoctor();
  }, []);
  


  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const userDataString = localStorage.getItem('doctor');
        if (userDataString) {
          const user = JSON.parse(userDataString);
          const doctorId = user?.userId;
          if (doctorId) {
            const response = await getAllDoctorAppointmentDetails(doctorId, currentPage, slotsPerPage, activeTab);
            setAppointments(response.data);
            setTotalAppointments(response.total);

            console.log('first.', response.data)

            console.log('first1.', response.todayCount)
            console.log('first2.', response.completedCount)
            console.log('first2.', response.totalEarnings)

           
            setTodayCount(response.todayCount);
            setCompletedCount(response.completedCount);
            
            setTotalEarnings(response.totalEarnings);
          }
        }
      } catch (error) {
        console.log('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, [currentPage, activeTab]);


  const totalPages = Math.ceil(totalAppointments / slotsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "booked":
        return "bg-green-400 text-green-800";
      case "completed":
        return "bg-yellow-400 text-yellow-800";
      case "cancelled":
        return "bg-red-400 text-red-800";
    
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 mt-44">
      {/* Header Section */}
    
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center">
                  <img
                    src={doctor?.profilePicture || '/api/placeholder/96/96'}
                    alt="Doctor"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{doctor?.name}</h1>
                  <p className="text-gray-500">{doctor?.department}</p>
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
          {['upcoming', 'past', 'cancelled'].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
              <Card key={appointment._id} className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  {/* Appointment details */}
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Patient Info */}
                    <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <img
                          src={appointment?.patientDetails?.profilePicture ?? 'unknown'}
                          alt="Doctor"
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      </div>
                      <div>
                      
                        <div className="flex items-center space-x-2 mt-1 font-medium">
                          <span className="text-sm">{appointment.patientDetails?.username}</span>
                        </div>
                        <h3 className="text-sm text-gray-500">
                          {appointment.patientDetails?.email}
                        </h3>
                        
                      </div>
                    </div>

                    {/* Contact & Mode */}
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
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-500">{appointment?.slotDetails?.timeSlot}</span>
                      </div>
                    </div>

                    {/* Medical Info */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          appointment.mode === 'Online' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {appointment?.slotDetails?.mode}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                        
                      </div>
                      <div className="flex space-x-2">
                        {appointment?.slotDetails?.mode === 'Offline' ? (
                          
                          <div className="flex items-center space-x-2 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">
                          {doctor?.location}
                          </span>
                        </div>
                          
                        ):(
                         
                            <Button
                            onClick={() => {
                              console.log("Video Call Button Clicked - Doctor Side",appointment?.patientDetails?._id );
                              handleCall(appointment?.patientDetails?.email ||"");
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white mt-2"
                            aria-label="Start Video Call"
                          >
                            <Video className="w-6 h-6 m-2" />
                            Start Consultation
                          </Button>
                          
                        )}
                        
                      </div>
                      
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col justify-between items-end">
                      <div className="flex items-center space-x-2 mb-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          appointment.paymentStatus === 'Paid'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {appointment.paymentStatus}
                        </span>
                        <span className="text-sm font-medium">₹{appointment.amount}</span>
                      </div>
                      <div className="flex space-x-2">

                      
                       


                        {appointment.status === "booked" ? (
                        <div>
                          <Button
                          onClick={()=> {handleAddPrescription(appointment?._id)}}
                            className={`${getStatusColor(appointment.status)} text-white`}
                          >
                             <TicketCheck className="w-6 h-6 m-2" />
                            Add prescription
                          </Button>
                         
                        </div>
                      ) : appointment.status === "completed" ? (
                       <>

                        <Button className={`${getStatusColor(appointment.status)} text-white`}>
                          <CircleCheck className="w-6 h-6 m-1" />
                          Completed
                        </Button>


                          {appointment.prescriptionStatus && (
                            <Button
                              onClick={() => handlePrescription(appointment?._id)}
                              className={`bg-red-600 text-white ml-2`}
                            >
                              Prescription
                            </Button>
                          )}
                       </>


                      ): appointment.status === "cancelled" ? (
                        <Button
                          className={`${getStatusColor(appointment.status)} text-white`}
                        >
                          <CircleX className="w-6 h-6 mr-2" />
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </Button>
                      )
                      
                      : (
                        <Button
                          className={`${getStatusColor(appointment.status)} text-white`}
                        >
                           <Ban className="w-6 h-6 mr-2" />
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </Button>
                      )}


                      </div>
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


      {/* Pagination */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Previous</Button>
        <span>Page {currentPage} of {totalPages}</span>
        <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next</Button>
      </div>
    </div>
  );
};

export default DoctorAppointmentDashboard;