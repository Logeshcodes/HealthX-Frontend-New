import { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, Mail, Phone, Award, Video, IndianRupeeIcon } from 'lucide-react';

import { getDoctorDetails , getSlotDetailsById , getUserData , walletPayment} from "../../../api/action/UserActionApi";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface UserData {
    _id : string;
}

interface Doctor {
    _id: string;
    name: string;
    email: string;
    Mobile: string;
    department: string;
    experience: string;
    role: string;
    education: string;
    location: string;
    description: string;
    consultationType: string;
    profilePicture: string;
    consultationFee: string;
  }
  
  interface Slot {
    _id : string ;
    date: string ;
    day?: string; 
    mode: string;
    timeSlot: string;
    email : string ;
  }

const WalletAppointmentConfirmation = () => {

    const [users, setUsers] = useState<UserData>();
      const [doctor, setDoctor] = useState<Doctor>({} as Doctor);
      const [slot, setSlots] = useState<Slot | null>(null);
      const [txnid, setTxnid] = useState<string>('');
 
  


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userDataString = localStorage.getItem("user");
        if (userDataString) {
          const user = JSON.parse(userDataString);
          const email = user?.email;

          if (email) {
            const data = await getUserData(email);
            setUsers(data);
          }


          console.log("user photo ----" ,user.profilePicture )
        }
      } catch (error) {
        console.log("Error fetching users:", error);
      } 
    };

    fetchUsers();
  }, []);



  
    const id = decodeURI(location.pathname.split('/').pop() || '');
    
    useEffect(() => {
      const fetchSlots = async () => {
        const response = await getSlotDetailsById(id);
        setSlots(response.data);
      };
      fetchSlots();
    }, [id]);
  
    useEffect(() => {
      const fetchDoctors = async () => {
        if (slot?.email) {
          const response = await getDoctorDetails(slot.email);
          setDoctor(response);
          
        }
      };
      fetchDoctors();
    }, [slot]);
    
    useEffect(() => {
      const generateTxnId = () => setTxnid(`txn_${new Date().getTime()}`);
      generateTxnId();
    }, []);

  const navigate = useNavigate()


  const handleConfirm = async () => {

    const slotId = slot?._id ;
    const patientId = users?._id ;
    const doctorId = doctor._id ;
    const paymentId = txnid ;
    const amount = doctor.consultationFee ;
   

    const data = {slotId , patientId , doctorId , paymentId , amount , }

    const response = await walletPayment(data) ;

    if(response.success){
        toast.success(response.message) ;
        navigate(`/user/patient/payment-success/${txnid}`)
    }else{
        toast.error(response.message) ;
    }
    
  };

  const handleBack = () => {
    navigate(-1)
  };



  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 mt-32">
    
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-6xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 py-6 px-6 text-center">
            <h1 className="text-2xl font-bold text-white">Appointment Confirmation</h1>
            <p className="text-blue-100 mt-1">Please review your appointment details</p>
          </div>
          
          {/* Doctor Info */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start">
              <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                <div className="relative">
                  <img 
                     src={doctor?.profilePicture || "/default-avatar.png"}
                    alt="Doctor" 
                    className="h-24 w-24 md:h-32 md:w-32 rounded-full object-cover border-4 border-blue-500"
                  />
                  <div className="absolute bottom-0 right-0 bg-blue-500 text-white text-xs font-bold rounded-full h-8 w-8 flex items-center justify-center md:h-10 md:w-10">
                    {doctor.education}
                  </div>
                </div>
              </div>
              
              <div className="text-center md:text-left flex-1">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">{doctor.name}</h2>
                <p className="text-blue-500 font-medium mb-2">{doctor.department}</p>
                
                <div className="flex flex-col md:flex-row gap-3 mt-4 flex-wrap">
                  <div className="flex items-center text-gray-600 text-sm">
                    <Award size={16} className="mr-1 text-blue-500" />
                    <span>{doctor.experience} years exp</span>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <IndianRupeeIcon size={16} className="mr-1 text-green-500" />
                    <span>{doctor.consultationFee} fee</span>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    {slot?.mode === "Online" ? (
                      <Video size={16} className="mr-1 text-purple-500" />
                    ) : (
                      <MapPin size={16} className="mr-1 text-red-500" />
                    )}
                    <span>{slot?.mode}</span>
                  </div>
                </div>
                
                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <div className="flex items-center text-gray-600 text-sm">
                    <Mail size={16} className="mr-1 text-gray-500" />
                    <span>{doctor.email}</span>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Phone size={16} className="mr-1 text-gray-500" />
                    <span>{doctor.Mobile}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Appointment Card */}
            <div className="mt-8 bg-blue-50 rounded-xl p-5 border border-blue-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Calendar size={20} className="mr-2 text-blue-500" />
                Appointment Details
              </h3>
              
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="bg-white p-3 rounded-lg shadow-sm text-center">
                  <p className="text-xs text-gray-500 font-medium">DATE</p>
                  <p className="text-gray-800 font-medium mt-1">{slot?.date ? new Date(slot.date).toLocaleDateString('en-GB') : 'No date available'}</p>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm text-center">
                  <p className="text-xs text-gray-500 font-medium">DAY</p>
                  <p className="text-gray-800 font-medium mt-1">{slot?.day}</p>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm text-center col-span-2 sm:col-span-1">
                  <p className="text-xs text-gray-500 font-medium">TIME</p>
                  <div className="flex items-center justify-center mt-1">
                    <Clock size={14} className="text-blue-500 mr-1" />
                    <p className="text-gray-800 font-medium">{slot?.timeSlot}</p>
                  </div>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm text-center col-span-2 sm:col-span-1">
                  <p className="text-xs text-gray-500 font-medium">MODE</p>
                  <p className="text-gray-800 font-medium mt-1 flex items-center justify-center">
                    {slot?.mode === "Online" ? (
                      <>
                        <Video size={14} className="text-purple-500 mr-1" />
                        Online
                      </>
                    ) : (
                      <>
                        <MapPin size={14} className="text-red-500 mr-1" />
                        In-person
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Location (conditionally rendered) */}
            {slot?.mode === "Offline" && (
              <div className="mt-6 bg-gray-50 rounded-xl p-5 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                  <MapPin size={20} className="mr-2 text-red-500" />
                  Location Details
                </h3>
                <p className="text-gray-600">{doctor.location}</p>
              </div>
            )}
            
            {/* Payment Info */}
            <div className="mt-6 bg-green-50 rounded-xl p-5 border border-green-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                <IndianRupeeIcon size={20} className="mr-2 text-green-500" />
                Payment Details
              </h3>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Consultation Fee:</span>
                <span className="font-bold text-gray-800">₹ {doctor.consultationFee}.00</span>
              </div>
            </div>
            
            {/* Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleConfirm}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-xl transition-colors duration-300 flex items-center justify-center"
              >
                Confirm Appointment
              </button>
              <button 
                onClick={handleBack}
                className="w-full bg-white hover:bg-gray-100 text-gray-600 font-medium py-3 px-4 rounded-xl border border-gray-300 transition-colors duration-300 flex items-center justify-center"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      
    </div>
  );
};

export default WalletAppointmentConfirmation;