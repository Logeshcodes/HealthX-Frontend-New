import React, { useEffect, useState } from 'react';
import { 
  Calendar, Clock, User, FileText, Settings,
  Search, Filter, Bell, CheckCircle2, XCircle,
  MoreVertical, Phone, Mail, Video, MapPin,
  FileCheck, Clock3, AlertCircle, Pencil
} from 'lucide-react';
import { CardContent , Card } from '../../../components/DoctorComponents/Appointments/card';
import { Button } from '../../../components/DoctorComponents/Appointments/button';
import { getAllDoctorAppointmentDetails } from '../../../api/action/DoctorActionApi';

// import { getAppointment } from '../../../api/action/UserActionApi';

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc"; 
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

interface Appointment{

    paymentId : string ,
    doctorEmail : string ,
    doctorName : string ,
    profilePicture : string ,
    amount : number ,
    paymentStatus : string ,
    appointmentTime : string ,
    appointmentDate : string ,
    department : string ,
    mode : string ,
    status : string ,
    patientEmail : string ,
  
  }

const DoctorAppointmentDashboard = () => {
  const [activeTab, setActiveTab] = useState('today');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const slotsPerPage = 10;

  const [todayCount, setTodayCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const userDataString = localStorage.getItem('doctor');

        if (userDataString) {
          const user = JSON.parse(userDataString);
          const email = user?.email;

          if (email) {
            const response = await getAllDoctorAppointmentDetails(email, currentPage, slotsPerPage);
            setAppointments(response.data);
            setTotalAppointments(response.total);

            console.log("resp____________", response.data)

            // const response2 = await getAppointment(email);

            // const today = dayjs().startOf("day");
            // const todayAppointments = response2.data.filter((apt: any) => dayjs.utc(apt.date).isSame(today, 'day'));
            // const completedAppointments = response2.data.filter((apt: any) => apt.status === 'completed');
            // const pendingAppointments = response2.data.filter((apt: any) => apt.status === 'pending');
            // const totalEarningsAmount = completedAppointments.reduce((sum: number, apt: any) => sum + (apt.amount || 0), 0);

            // setTodayCount(todayAppointments.length);
            // setCompletedCount(completedAppointments.length);
            // setPendingCount(pendingAppointments.length);
            // setTotalEarnings(totalEarningsAmount);
          }
        }
      } catch (error) {
        console.log('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, [currentPage]);



  const totalPages = Math.ceil(totalAppointments / slotsPerPage);

  const getStatusColor = (status: any) => {
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
            <div className="bg-white shadow-sm border-b">
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
      {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">Today's Appointments</p>
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
                  <p className="text-sm opacity-80">Completed Today</p>
                  <p className="text-3xl font-bold mt-2">{completedCount}</p>
                </div>
                <CheckCircle2 className="w-8 h-8 opacity-80" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">Pending</p>
                  <p className="text-3xl font-bold mt-2">{pendingCount}</p>
                </div>
                <Clock3 className="w-8 h-8 opacity-80" />
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
      </div> */}

      {/* Quick Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 mt-9">
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              View Schedule
            </Button>
            {/* <Button variant="outline" className="border-indigo-600 text-indigo-600">
              Block Time Slot
            </Button> */}
          </div>
          {/* <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search patients..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-64"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div> */}
        </div>
      </div>

      {/* Appointments List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {appointments.length > 0 ? (
            appointments.map((appointment) => (

              <Card key={appointment.paymentId} className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">


                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Patient Info */}
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        
                        {/* <p className="text-sm text-gray-500">{appointment.age} years, {appointment.gender}</p> */}
                        <div className="flex items-center space-x-2 mt-4 font-medium">
                        
                        <span className="text-sm">{appointment.patientEmail}</span>
                        </div>
                      </div>
                    </div>

                    {/* Contact & Mode */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Phone className="w-4 h-4" />
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
                      {/* <p className="text-sm text-gray-600">
                        <span className="font-medium">Concern:</span> {appointment.concern}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Previous Visit:</span> {appointment.previousVisit}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {appointment.medicalHistory.map((condition, index) => (
                          <span key={index} className="px-2 py-1 bg-red-50 text-red-700 rounded-full text-xs">
                            {condition}
                          </span>
                        ))}
                      </div> */}
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
                        <Button variant="outline" className="border-gray-300">
                          <MoreVertical className="w-4 h-4" />
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

      {/* Floating Action Buttons */}
      {/* <div className="fixed bottom-8 right-8 flex flex-col space-y-4">
        <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg">
          <FileCheck className="w-6 h-6" />
        </Button>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg">
          <Calendar className="w-6 h-6" />
        </Button>
      </div> */}

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