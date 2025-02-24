import { useEffect, useState } from 'react';
import { 
  Calendar, Clock, User, MapPin, FileText, 
  ChevronRight, Search, Filter, Video, Download,
  CheckCircle2, XCircle, Clock3 , PlusCircle
} from 'lucide-react';
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc"; 
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

import { CardContent , Card } from '../../../components/DoctorComponents/Appointments/card';
import { Button } from '../../../components/DoctorComponents/Appointments/button';

import { getAllAppointmentDetails , getAppointment } from '../../../api/action/UserActionApi';


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
    location : string ,
    status : string ,
    patientEmail : string ,
  
  }

const AppointmentDashboard = () => {
    const [activeTab, setActiveTab] = useState('upcoming');
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalAppointments, setTotalAppointments] = useState(0);
    const slotsPerPage = 5;

    const [upcomingCount, setUpcomingCount] = useState(0);
    const [completedCount, setCompletedCount] = useState(0);
    const [totalSpent, setTotalSpent] = useState(0);
  
    useEffect(() => {
      const fetchAppointments = async () => {
        try {
          const userDataString = localStorage.getItem('user');// instead of "doctor"

          const today = dayjs().startOf("day"); 


          if (userDataString) {
            const user = JSON.parse(userDataString);
            const email = user?.email;
  
            if (email) {

              console.log("datas.." , email, currentPage, slotsPerPage , activeTab )




              const response = await getAllAppointmentDetails(email, currentPage, slotsPerPage , activeTab  );
              setAppointments(response.data);
              setTotalAppointments(response.total);

              console.log("OOOOOOOOOOOOOOOOOOO" , response.data)


              const response2 = await getAppointment(email);

              const upcoming = response2.data.filter((apt : any) => dayjs.utc(apt.appointmentDate).isAfter(today)  && apt.status !== 'cancelled');
              const completed = response2.data.filter((apt : any) => dayjs.utc(apt.appointmentDate).isBefore(today) && apt.status !== 'cancelled');
              const totalSpentAmount = completed.reduce((sum : number , apt : any) => sum + (apt.amount || 0), 0);

              console.log("_____________?/??" , upcoming ,completed , totalSpentAmount)
              
              setUpcomingCount(upcoming.length);
              setCompletedCount(completed.length);
              setTotalSpent(totalSpentAmount);
            }
          }
        } catch (error) {
          console.log('Error fetching appointments:', error);
        }
      };
  
      fetchAppointments();
    }, [currentPage , activeTab]);
  
    // const filteredAppointments = appointments.filter((appointment) => {
    //   const appointmentDate = new Date(appointment.appointmentDate);
    //   const today = new Date();
    //   today.setHours(0, 0, 0, 0);
  
    //   if (activeTab === 'upcoming') {
    //     return appointmentDate >= today && appointment.status !== 'cancelled';
    //   } else if (activeTab === 'past') {
    //     return appointmentDate < today && appointment.status !== 'cancelled';
    //   } 
      
    //   else if (activeTab === 'cancelled') {
    //     return appointment.status === 'cancelled';
    //   }
  
    //   return true;
    // });
  
    const totalPages = Math.ceil(totalAppointments / slotsPerPage);


  

  const getStatusColor = (status : any) => {
    switch (status) {
      case 'Booked': return 'bg-green-500 text-green-800';
      case 'pending': return 'bg-yellow-500 text-yellow-800';
      case 'cancelled': return 'bg-red-500 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 mt-36">
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
            <div className="flex items-center space-x-4">
             
              
             
              
            </div>
          </div>
        </div>
      </div>


       {/* Stats Section */}
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">Upcoming Appointments</p>
                  <p className="text-3xl font-bold mt-2">{upcomingCount}</p>
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
                  <p className="text-sm opacity-80">Total Spent</p>
                  <p className="text-3xl font-bold mt-2">₹ {totalSpent}</p>
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
            <button key={tab} className={`px-4 py-2 text-sm font-medium ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab(tab)}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)} 
            </button>
          ))}
        </div>
      </div>

     
      

      {/* Appointments List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">



            
          { appointments.length > 0 ? (

            appointments.map((appointment) => (


            
            <Card key={appointment.paymentId} className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Doctor Info */}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <img
                    src={appointment.profilePicture || '/api/placeholder/96/96'}
                    alt="Doctor"
                    className="w-12 h-12 rounded-full object-cover"
                    />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{appointment.doctorName}</h3>
                      <p className="text-sm text-gray-500">{appointment.department}</p>
                    </div>
                  </div>

                  {/* Date & Time */}
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
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{appointment.appointmentTime}</span>
                    </div>
                  </div>

                  {/* Location & Mode */}
                  <div className="space-y-2">

                    { appointment.mode === 'Offline' ? (

                    <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{appointment.location}</span>
                    </div>


                    ) : (

                      <div>

                     

                      <span className={`px-2 py-1 rounded-full text-xs ml-6 font-medium ${
                        appointment.mode === 'Online' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {appointment.mode}
                      </span>


                         
                      <Button className="bg-blue-600 hover:bg-blue-700 ml-8 text-white">
                      <Video className="w-4 h-4" />
                      </Button>

                

                      </div>
                    

                    
                    )
                    
                  
                  
                  }
                   
                    {/* <div className="flex items-center space-x-2">
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
                    </div> */}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end space-x-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Amount</p>
                      <p className="font-medium text-gray-900">₹{appointment.amount}</p>
                    </div>
                    

                    {
                      appointment.status === 'Booked' ? (

                     <div>
                       <Button className={`${getStatusColor(appointment.status)} text-white`}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </Button>
                     <Button className="bg-red-600 hover:bg-red-700 text-white ml-2">
                     Cancel
                    </Button>
                     </div>

                      ) : (

                        <Button className={`${getStatusColor(appointment.status)} text-white`}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </Button>
                       
                      )
                    }
                   
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
          ):(
            <div>No Appointment available</div>
          )
       
          
          }
        </div>
      </div>

      {/* Action Button */}
      <div className="fixed bottom-8 right-8">
        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg">
          <Calendar className="w-6 h-6" />
        </Button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Previous</Button>
        <span>Page {currentPage} of {totalPages}</span>
        <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next</Button>
      </div>
    </div>
  );
};

export default AppointmentDashboard;