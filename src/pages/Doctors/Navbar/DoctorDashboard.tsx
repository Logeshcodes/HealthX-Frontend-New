import { useEffect, useState } from 'react';
import { Calendar, Clock, CheckCircle2, DollarSign, Users, PieChart, TrendingUp, Activity } from 'lucide-react';
import { CardContent , Card } from '../../../components/AdminComponents/common/Card';
import { Button } from '../../../components/Common/button/Button2';
import { getAllDoctorAppointmentDetails, getDoctorData } from '../../../api/action/DoctorActionApi';
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc"; 
import timezone from "dayjs/plugin/timezone";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

dayjs.extend(utc);
dayjs.extend(timezone);

interface PatientDetails {
  _id?: string | undefined;
  username: string;
  email: string;
  profilePicture: string;
}

interface SlotDetails {
  _id: string;
  mode: string;
  day: string;
  date: string;
  timeSlot: string;
}

interface Appointment {
  _id: string;
  paymentId: string;
  doctorId: string;
  doctorEmail: string;
  doctorName: string;
  profilePicture: string;
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

interface Doctor {
  profilePicture: string;
  name: string;
  department: string;
  location: string;
  email: string;
}

interface RevenueData {
  month: string;
  revenue: number;
}

interface AppointmentStats {
  name: string;
  value: number;
  color: string;
}

const DoctorDashboard = () => {
  const [doctor, setDoctor] = useState<Doctor>();
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [appointmentStats, setAppointmentStats] = useState<AppointmentStats[]>([]);
  
  // Stats
  const [todayCount, setTodayCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [cancelledCount, setCancelledCount] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalPatients, setTotalPatients] = useState(0);

  const navigate = useNavigate();

  // Generate monthly revenue data (this would ideally come from your backend)
  const generateRevenueData = (completedAppointments: Appointment[]) => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonth = new Date().getMonth();
    
    // Create last 6 months data
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const monthIndex = (currentMonth - i + 12) % 12;
      return monthNames[monthIndex];
    }).reverse();
    
    // Initialize revenue data with 0 for each month
    const initialData = last6Months.map(month => ({ month, revenue: 0 }));
    
    // Populate with actual data from completed appointments
    completedAppointments.forEach(appointment => {
      if (appointment.status === 'completed' && appointment.paymentStatus === 'success') {
        const appointmentDate = new Date(appointment.appointmentTime || appointment.slotDetails?.date || '');
        const month = monthNames[appointmentDate.getMonth()];
        
        if (last6Months.includes(month)) {
          const monthData = initialData.find(data => data.month === month);
          if (monthData) {
            monthData.revenue += appointment.amount;
          }
        }
      }
    });
    
    return initialData;
  };

  // Calculate appointment distribution stats
  const calculateAppointmentStats = (appointments: Appointment[]) => {
    const upcoming = appointments.filter(a => a.status === 'booked').length;
    const completed = appointments.filter(a => a.status === 'completed').length;
    const cancelled = appointments.filter(a => a.status === 'cancelled').length;
    
    return [
      { name: 'Upcoming', value: upcoming, color: '#3b82f6' },
      { name: 'Completed', value: completed, color: '#10b981' },
      { name: 'Cancelled', value: cancelled, color: '#ef4444' }
    ];
  };

  // Function to get unique patients count
  const calculateUniquePatients = (appointments: Appointment[]) => {
    const uniqueEmails = new Set(appointments.map(a => a.patientEmail));
    return uniqueEmails.size;
  };

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const userDataString = localStorage.getItem('doctor');
        if (userDataString) {
          const user = JSON.parse(userDataString);
          const email = user?.email;
          const doctorId = user?.userId;
          
          if (email && doctorId) {
            // Fetch doctor profile data
            const doctorResponse = await getDoctorData(email);
            setDoctor(doctorResponse);
            
            // Fetch all appointment types to calculate stats
            const upcomingResponse = await getAllDoctorAppointmentDetails(doctorId, 1, 100, 'upcoming');
            const pastResponse = await getAllDoctorAppointmentDetails(doctorId, 1, 100, 'past');
            const cancelledResponse = await getAllDoctorAppointmentDetails(doctorId, 1, 100, 'cancelled');
            
            // Set upcoming appointments for display
            setUpcomingAppointments(upcomingResponse.data);
            
            // Combine all appointments for stats
            const allAppointments = [
              ...upcomingResponse.data,
              ...pastResponse.data,
              ...cancelledResponse.data
            ];
            
            // Calculate stats
            setTodayCount(upcomingResponse.todayCount);
            setCompletedCount(pastResponse.total);
            setCancelledCount(cancelledResponse.total);
            setTotalEarnings(upcomingResponse.totalEarnings);
            setTotalPatients(calculateUniquePatients(allAppointments));
            
            // Generate revenue data and appointment stats
            setRevenueData(generateRevenueData([...pastResponse.data]));
            setAppointmentStats(calculateAppointmentStats(allAppointments));
          }
        }
      } catch (error) {
        console.log('Error fetching doctor data:', error);
      }
    };
    
    fetchDoctorData();
  }, []);

  // Navigate to appointments dashboard
  const navigateToAppointments = () => {
    navigate('/doctor/bookedAppointments');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 pt-16 mt-20">
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
                <h1 className="text-2xl font-bold text-gray-900">Welcome, Dr. {doctor?.name}</h1>
                <p className="text-gray-500">{doctor?.department} • {dayjs().format('MMMM D, YYYY')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
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
                  <p className="text-sm opacity-80">Completed</p>
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
                <DollarSign className="w-8 h-8 opacity-80" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-amber-500 to-amber-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">Total Patients</p>
                  <p className="text-3xl font-bold mt-2">{totalPatients}</p>
                </div>
                <Users className="w-8 h-8 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           {/* Revenue Chart */}
  <Card className="transition-all duration-300 hover:shadow-lg">
    <CardContent className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Revenue Trend</h2>
        <TrendingUp className="w-5 h-5 text-gray-500" />
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              tick={{ fill: '#6b7280' }}
              tickLine={false}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis 
              tickFormatter={(value) => `₹${value}`}
              tick={{ fill: '#6b7280' }}
              tickLine={false}
              axisLine={{ stroke: '#e5e7eb' }}
              width={80}
            />
            <Tooltip 
              formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
              contentStyle={{ backgroundColor: '#fff', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '10px' }}
              formatter={(value) => <span className="text-gray-600">{value}</span>}
            />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ r: 6, strokeWidth: 2, fill: '#fff' }}
              activeDot={{ r: 8, strokeWidth: 0, fill: '#2563eb' }}
              isAnimationActive={true}
              animationDuration={1500}
              animationEasing="ease-in-out"
              name="Monthly Revenue"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
        <span>Last 6 months</span>
        <span className="font-medium text-blue-600">
          Total: ₹{revenueData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
        </span>
      </div>
    </CardContent>
  </Card>

          {/* Appointment Distribution Chart */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Appointment Distribution</h2>
                <PieChart className="w-5 h-5 text-gray-500" />
              </div>
              <div className="h-64 flex flex-col items-center justify-center">
                <div className="grid grid-cols-3 gap-4 w-full">
                  {appointmentStats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center" style={{ backgroundColor: stat.color + '30', color: stat.color }}>
                        <span className="text-2xl font-bold">{stat.value}</span>
                      </div>
                      <p className="mt-2 text-sm font-medium text-gray-600">{stat.name}</p>
                      <p className="text-xs text-gray-500">
                        {appointmentStats.reduce((sum, s) => sum + s.value, 0) > 0 
                          ? Math.round((stat.value / appointmentStats.reduce((sum, s) => sum + s.value, 0)) * 100) + '%'
                          : '0%'
                        }
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Appointments Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Upcoming Appointments</h2>
          <Button 
            onClick={navigateToAppointments}
            className="bg-blue-600 hover:bg-blue-700 text-white mt-2"
          >
            View All
          </Button>
        </div>

        <div className="space-y-4">
          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.slice(0, 3).map((appointment) => (
              <Card key={appointment._id} className="hover:shadow-lg transition-shadow duration-200">
				<CardContent className="p-6">
                  {/* Appointment details */}
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Patient Info */}
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <img
                          src={appointment?.patientDetails?.profilePicture || '/api/placeholder/96/96'}
                          alt="Patient"
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mt-1 font-medium">
                          <span className="text-sm">{appointment.patientDetails?.username || 'Patient'}</span>
                        </div>
                        <h3 className="text-sm text-gray-500">
                          {appointment.patientDetails?.email || appointment.patientEmail}
                        </h3>
                      </div>
                    </div>

                    {/* Appointment Time */}
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

                    {/* Appointment Type */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          appointment?.slotDetails?.mode === 'Online' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {appointment?.slotDetails?.mode || appointment.mode}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          appointment.status === "booked"
                            ? "bg-green-400 text-green-800"
                            : appointment.status === "completed"
                            ? "bg-yellow-400 text-yellow-800"
                            : "bg-red-400 text-red-800"
                        }`}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Booked Specialist :  {doctor?.department}
                      </div>
                    </div>

                    {/* Payment Info */}
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
                     
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No upcoming appointments found</p>
              <p className="text-sm mt-2">Your schedule is clear for now</p>
            </div>
          )}
        </div>
      </div>

      {/* Performance Metrics Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Performance Metrics</h2>
              <Activity className="w-5 h-5 text-gray-500" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm text-gray-500">Appointment Completion Rate</h3>
                </div>
                <div className="text-xl font-bold text-gray-900">
                  {completedCount + cancelledCount > 0 
                    ? Math.round((completedCount / (completedCount + cancelledCount)) * 100) 
                    : 0}%
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ 
                      width: `${completedCount + cancelledCount > 0 
                        ? Math.round((completedCount / (completedCount + cancelledCount)) * 100) 
                        : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm text-gray-500">Average Revenue per Appointment</h3>
                </div>
                <div className="text-xl font-bold text-gray-900">
                  ₹{completedCount > 0 ? Math.round(totalEarnings / completedCount) : 0}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Based on {completedCount} completed appointments
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm text-gray-500">Cancellation Rate</h3>
                </div>
                <div className="text-xl font-bold text-gray-900">
                  {completedCount + cancelledCount > 0 
                    ? Math.round((cancelledCount / (completedCount + cancelledCount)) * 100) 
                    : 0}%
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full" 
                    style={{ 
                      width: `${completedCount + cancelledCount > 0 
                        ? Math.round((cancelledCount / (completedCount + cancelledCount)) * 100) 
                        : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      
    </div>
  );
};

export default DoctorDashboard;