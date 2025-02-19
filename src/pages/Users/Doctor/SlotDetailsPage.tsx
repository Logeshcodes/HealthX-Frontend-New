import { Card , CardContent, CardHeader } from '../../../components/AdminComponents/common/Card';
import { Calendar, Clock, Phone, Mail, Award, Languages, CheckCircle, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import CryptoJS from 'crypto-js';
import { getDoctorDetails , getSlotDetailsById } from "../../../api/action/UserActionApi";
import { getUserData } from "../../../api/action/UserActionApi";
// import {config} from "dotenv"

// config()

interface Doctor {
  name: string;
  email: string;
  Mobile: string;
  department: string;
  experience: string;
  role: string;
  education: string;
  description: string;
  consultationType: string;
  profilePicture: string;
  consultationFee: string;
}

interface Slot {
  date: string ;
  day?: string; 
  mode: string;
  timeSlot: string;
  email : string ;
}

interface UserData {
  username: string;
  email: string;
  mobileNumber: string;
  profilePicture: string;
  isBlocked: string;
  createdAt: string;
  updatedAt: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  bloodGroup: string;
}

const SlotDetailsPage = () => {
  const [doctor, setDoctor] = useState<Doctor>({} as Doctor);
  const [slot, setSlots] = useState<Slot | null>(null);
  const [txnid, setTxnid] = useState<string>('');
  const [hash, setHash] = useState<string>('');
  const [users, setUsers] = useState<UserData>();



  
  // fetch user 

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

  console.log("user_____" , users)
 

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
  
  console.log(doctor,"doctor")
  const doctorDetails = {
    languages: ["Tamil", "English", "Malayalam"],
  };




  

  useEffect(() => {
    
    if (!txnid || !id || !doctor || !users?.email) return;

    console.log("ok ___________" , users?.email)

    const key = 't4VOu4';
    const salt = 'h1r2JIjnHkpgtJrfBkfqKOS02hi3B0UB';



    const amount = doctor?.consultationFee;
    const productinfo = id;
    const firstname = doctor?.name ;
    const userEmail = doctor?.email ;
    const udf1 = users?.email;

    // Ensure all required fields are present
    if (!key || !txnid || !amount || !productinfo || !firstname || !userEmail || !udf1 || !salt) {
      // console.log(amount,txnid,key , productinfo , firstname ,userEmail,salt , udf1,"-----hbd logesh")

      toast.error('Missing required payment details. Please refresh and try again.');
      return;
    }

    // Concatenate the fields in the correct order
    const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${userEmail}|${udf1}||||||||||${salt}`;

    // Generate the SHA512 hash
    const hash = CryptoJS.SHA512(hashString).toString(CryptoJS.enc.Hex);
    setHash(hash);
  }, [doctor]);

  const handlePayment = () => {
    if (!doctor.name || !doctor.consultationFee || !id || !txnid || !hash || !users?.email) {

      // console.log("comings..........." ,doctor.name , doctor.consultationFee , id ,txnid,hash, users?.email,"hbd logesh")
      toast.error('Invalid payment details. Please refresh and try again.');
      return;
    }

    const surl = `http://localhost:5000/user/patient/payment-success`;
    const furl = `http://localhost:5000/user/patient/payment-failure`;

    const formData = {
      key: 't4VOu4',
      txnid,
      amount: doctor.consultationFee,
      productinfo: id,
      firstname: doctor.name,
      email: doctor.email,
      phone: doctor.Mobile,
      udf1: users?.email,
      surl,
      furl,
      hash,
    };

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://test.payu.in/_payment';

    Object.keys(formData).forEach((key) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = formData[key as keyof typeof formData] || '';
      form.appendChild(input);
    });

    document.body.appendChild(form);
   
    form.submit();
  };

  return (




    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6 mt-40">
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Appointment Details Preview</h1>
        <div className="h-1 w-20 bg-blue-600 mx-auto rounded-full"></div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Doctor Information Card */}
        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <div className="flex items-center space-x-4">
            <div className="relative mb-6 group">
                  <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center overflow-hidden transform transition-transform group-hover:scale-105">
                  <img
                      src={doctor?.profilePicture || "/default-avatar.png"}
                      alt="Profile"
                      className="max-w-20 h-20 rounded-full object-cover"
                      onError={(e) => (e.currentTarget.src = "/default-avatar.png")}
                    />
                  </div>

                  <div className="absolute -bottom-0 left-16 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white border-2 border-white">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  
                </div>
              <div>
                <h2 className="text-2xl font-semibold">Mr .{doctor.name}</h2>
                <p className="text-blue-100 mt-2">{doctor?.department}</p>
                <div className="flex items-center mt-2">
                  <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-sm">
                    ⭐ Fees : {doctor.consultationFee} Rupees
                  </span>
                 

                  {/* <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-lg flex">
                  <BadgeCheck className='mr-1'/>
                   Verified Doctor
                  </span> */}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <Mail className="text-blue-600" size={20} />
                <span className="text-gray-700">{doctor.email}</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-indigo-50 rounded-lg">
                <Phone className="text-indigo-600" size={20} />
                <span className="text-gray-700">+91 - {doctor.Mobile}</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                <Award className="text-purple-600" size={20} />
                <span className="text-gray-700">{doctor.education} • {doctor.experience} Years experience</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <Languages className="text-blue-600" size={20} />
                <span className="text-gray-700">{doctorDetails.languages.join(", ")}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Slot Information Card */}
        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
            <h2 className="text-2xl font-semibold flex items-center">
              <Clock className="mr-2" size={24} />
              Selected Time Slot
            </h2>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar className="text-indigo-600" size={24} />
                  <div>
                  <p className="text-gray-700 font-medium">
                    {slot?.date ? new Date(slot.date).toLocaleDateString('en-GB') : 'No date available'}
                  </p>
                    <p className="text-gray-500">{slot?.day}</p>
                  </div>
                </div>
                <div className="bg-indigo-100 px-3 py-1 rounded-full">
                  <span className="text-indigo-700">#{slot?.mode}</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="text-purple-600" size={24} />
                  <div>
                    <p className="text-gray-700 font-medium">{slot?.timeSlot}</p>
                    <p className="text-gray-500">Duration: 1 hour</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 bg-green-100 px-3 py-1 rounded-full">
                  <CheckCircle className="text-green-600" size={16} />
                  <span className="text-green-700">Available</span>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0">
              <button onClick={handlePayment} className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 flex items-center justify-center">
                <CheckCircle className="mr-2" /> Confirm Appointment
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Information Card */}
      <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 mt-6">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <AlertCircle className="text-blue-600" size={24} />
            <h3 className="text-xl font-semibold text-gray-800">Important Information</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 mt-2 rounded-full bg-blue-600"></div>
                <p className="text-gray-600">Please arrive 10 minutes before your appointment time</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 mt-2 rounded-full bg-indigo-600"></div>
                <p className="text-gray-600">Bring any relevant medical records or test reports</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 mt-2 rounded-full bg-purple-600"></div>
                <p className="text-gray-600">Consultation duration: 1 hour</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 mt-2 rounded-full bg-blue-600"></div>
                <p className="text-gray-600">Cancellation must be done at least 2 hours before the appointment</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
  );
};

export default SlotDetailsPage;
