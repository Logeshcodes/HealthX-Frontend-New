
// import { CardContent , Card } from '../../../components/DoctorComponents/Appointments/card';
// import { Button } from '../../../components/DoctorComponents/Appointments/button';
// import { Calendar, Clock, User, ArrowRight, ArrowLeft, PlusCircle } from 'lucide-react';

// const AppointmentsPage = () => {
//   // Sample appointment data
//   const pastAppointments = [
//     {
//       date: '15-02-2025',
//       // doctor: 'Dr. SarahWilson',
//       time: '12:00',
//       type: 'online'
//     },
//     {
//       date: '15-02-2025',
//       doctor: 'Dr. SarahWilson',
//       time: '01:00',
//       type: 'Fever'
//     }
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-teal-50 p-4 md:p-8 mt-36">
//       <div className="max-w-4xl mx-auto space-y-8">
//         {/* Past Appointments Section */}
//         <section>
//           <h2 className="text-2xl font-semibold text-gray-800 mb-4">Past Appointments</h2>
//           <div className="space-y-4">
//             {pastAppointments.map((appointment, index) => (
//               <Card key={index} className="bg-emerald-50/80 hover:bg-emerald-50 transition-colors">
//                 <CardContent className="p-4">
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                     <div className="flex items-center space-x-2">
//                       <Calendar className="w-5 h-5 text-gray-600" />
//                       <span className="text-gray-700">Date: {appointment.date}</span>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <User className="w-5 h-5 text-gray-600" />
//                       <span className="text-gray-700">Doctor: {appointment.doctor}</span>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <Clock className="w-5 h-5 text-gray-600" />
//                       <span className="text-gray-700">Time: {appointment.time}</span>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <div className="rounded-full bg-emerald-100 p-1">
//                         <ArrowRight className="w-4 h-4 text-emerald-600" />
//                       </div>
//                       <span className="text-gray-700">Type: {appointment.type}</span>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
          
//           {/* Pagination */}
//           <div className="flex justify-center mt-6 space-x-2">
//             <Button variant="outline" size="sm" className="flex items-center">
//               <ArrowLeft className="w-4 h-4 mr-1" /> Previous
//             </Button>
//             <Button variant="outline" size="sm" className="flex items-center">
//               Next <ArrowRight className="w-4 h-4 ml-1" />
//             </Button>
//           </div>
//         </section>

//         {/* Upcoming Appointments Section */}
//         <section>
//           <h2 className="text-2xl font-semibold text-gray-800 mb-4">Upcoming Appointments</h2>
//           <Card className="bg-white/50 backdrop-blur-sm">
//             <CardContent className="p-8 text-center">
//               <div className="flex flex-col items-center justify-center space-y-4">
//                 <h3 className="text-xl text-gray-700">No Upcoming Appointments</h3>
//                 <p className="text-gray-600">Schedule Your Appointment Today!</p>
//                 <Button className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center space-x-2">
//                   <PlusCircle className="w-4 h-4" />
//                   <span>Schedule Appointment</span>
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </section>
//       </div>
//     </div>
//   );
// };

// export default AppointmentsPage;