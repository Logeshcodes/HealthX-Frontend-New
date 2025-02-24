import  { useEffect, useState } from 'react';
import { Calendar, Clock, User, FileText, CheckCircle2, Video,} from 'lucide-react';
import { CardContent , Card } from '../../../components/DoctorComponents/Appointments/card';
import { Button } from '../../../components/DoctorComponents/Appointments/button';
import { getAllDoctorAppointmentDetails , getAppointment} from '../../../api/action/DoctorActionApi';
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc"; 
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

interface Appointment {
  paymentId: string;
  doctorEmail: string;
  doctorName: string;
  profilePicture: string;
  amount: number;
  paymentStatus: string;
  appointmentTime: string;
  appointmentDate: string;
  department: string;
  mode: string;
  status: string;
  patientEmail: string;
}

const DoctorAppointmentDashboard = () => {
  const [activeTab, setActiveTab] = useState('upcoming'); // Default to 'upcoming'
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const slotsPerPage = 5;

  const [todayCount, setTodayCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  const [totalEarnings, setTotalEarnings] = useState(0);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const userDataString = localStorage.getItem('doctor');
        if (userDataString) {
          const user = JSON.parse(userDataString);
          const email = user?.email;
          if (email) {
            const response = await getAllDoctorAppointmentDetails(email, currentPage, slotsPerPage, activeTab);
            setAppointments(response.data);
            setFilteredAppointments(response.data);
            setTotalAppointments(response.total);

            const response2 = await getAppointment(email);

            const today = dayjs().startOf("day");
            const todayAppointments = response2.data.filter((apt: Appointment) => dayjs.utc(apt.appointmentDate).isAfter(today)  && apt.status !== 'cancelled');
            const completedAppointments = response2.data.filter((apt: Appointment) => dayjs.utc(apt.appointmentDate).isBefore(today) && apt.status !== 'cancelled');
          
            const totalEarningsAmount = completedAppointments.reduce((sum: number, apt: Appointment) => sum + (apt.amount || 0), 0);

            setTodayCount(todayAppointments.length);
            setCompletedCount(completedAppointments.length);
            
            setTotalEarnings(totalEarningsAmount);
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
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 mt-44">
      {/* Header Section */}
      {appointments.slice(0, 1).map((appointment) => (
        <div className="bg-white shadow-sm border-b" key={appointment.paymentId}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center">
                  <img
                    src={appointment.profilePicture || '/api/placeholder/96/96'}
                    alt="Doctor"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{appointment.doctorName}</h1>
                  <p className="text-gray-500">{appointment.department}</p>
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
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment) => (
              <Card key={appointment.paymentId} className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  {/* Appointment details */}
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Patient Info */}
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mt-4 font-medium">
                          <span className="text-sm">{appointment.patientEmail}</span>
                        </div>
                      </div>
                    </div>

                    {/* Contact & Mode */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">
                          {new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-500">{appointment.appointmentTime}</span>
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
                          {appointment.mode}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
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
                        {appointment.mode === 'Online' && (
                          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                            <Video className="w-4 h-4" />
                          </Button>
                        )}
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                          Start Consultation
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div>No Appointments available</div>
          )}
        </div>
      </div>

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