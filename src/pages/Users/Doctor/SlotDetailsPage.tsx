import { Card , CardContent, CardHeader } from '../../../components/AdminComponents/common/Card';
import { Calendar, Clock, Phone, Mail, Languages, CheckCircle, AlertCircle, MapPin, ChevronUp, ChevronDown, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import CryptoJS from 'crypto-js';
import { getDoctorDetails , getSlotDetailsById } from "../../../api/action/UserActionApi";
import { getUserData } from "../../../api/action/UserActionApi";
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
// import {config} from "dotenv"

// config()

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

interface Transaction{
  date :  Date 
  
}

interface UserData {
  _id : string ,
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
  wallet : {
    balance : number ;
    transactions : Array<Transaction>;
  }
}

const SlotDetailsPage = () => {
  const [doctor, setDoctor] = useState<Doctor>({} as Doctor);
  const [slot, setSlots] = useState<Slot | null>(null);
  const [txnid, setTxnid] = useState<string>('');
  const [hash, setHash] = useState<string>('');
  const [users, setUsers] = useState<UserData>();

  const [showBalance, setShowBalance] = useState(false);


  
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

  const navigate = useNavigate()


  

  useEffect(() => {
    
    if (!txnid || !id || !doctor || !users?._id) return;

    console.log("ok ___________" , users?._id)
    console.log("ok ___________" , doctor?._id)

    const key = 't4VOu4';
    const salt = 'h1r2JIjnHkpgtJrfBkfqKOS02hi3B0UB';



    const amount = doctor?.consultationFee;
    const productinfo = id;
    const firstname = doctor?.name ;
    const userEmail = doctor?.email ;
    const udf1 = users?._id;
    const udf2 = doctor?._id;

    
    if (!key || !txnid || !amount || !productinfo || !firstname || !userEmail || !udf1 || !udf2 || !salt) {
    

      toast.error('Missing required payment details. Please refresh and try again.');
      return;
    }

   
    const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${userEmail}|${udf1}|${udf2}|||||||||${salt}`;

    const hash = CryptoJS.SHA512(hashString).toString(CryptoJS.enc.Hex);
    setHash(hash);
  }, [doctor]);


  
  


  const handleWalletPayment = (id : string ) => {

      try {

        // console.log("PPPPPPPPPPPP" , users?.wallet?.balance)
        if(Number(doctor.consultationFee) > Number(users?.wallet?.balance)){
          toast.error("Insuffient wallet Balance")
        }else{
          navigate(`/user/walletPayment/${id}`);
        }
      } catch (error) {
        console.log(error)
      }
  }

  const handlePayment = () => {
    if (!doctor.name || !doctor.consultationFee || !id || !txnid || !hash || !users?.email) {

      // console.log("comings..........." ,doctor.name , doctor.consultationFee , id ,txnid,hash, users?.email,"hbd logesh")
      toast.error('Invalid payment details. Please refresh and try again.');
      return;
    }


    // Development mode 

    // const surl = `http://localhost:5000/api/booking/patient/payment-success`;
    // const furl = `http://localhost:5000/api/booking/patient/payment-failure`;

    // Production mode 

    const surl = `http://api-gateway-srv/api/booking/patient/payment-success`;
    const furl = `http://api-gateway-srv/api/booking/patient/payment-failure`;

    const formData = {
      key: 't4VOu4',
      txnid,
      amount: doctor.consultationFee,
      productinfo: id,
      firstname: doctor.name,
      email: doctor.email,
      phone: doctor.Mobile,
      udf1: users?._id,
      udf2: doctor?._id,
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
                <p className="text-blue-100 mt-2">{doctor?.department} ( {doctor.experience} Years experience)</p>
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
              {/* <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                <Award className="text-purple-600" size={20} />
                <span className="text-gray-700">{doctor.education} • {doctor.experience} Years experience</span>
              </div> */}
             
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <Languages className="text-blue-600" size={20} />
                <span className="text-gray-700">{doctorDetails.languages.join(", ")}</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                <MapPin className="text-purple-600" size={20} />
                <span className="text-gray-700">{doctor.location}</span>
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
                <CheckCircle className="mr-2" /> Pay-U Payment
              </button>
            </div>

             {/* Divider */}
             <div className="relative ">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className=" bg-white text-gray-500">
                        Or With
                      </span>
                    </div>
            </div>

            <div className="p-6 pt-0">
              <button onClick={() => handleWalletPayment(slot?._id || "")} className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 flex items-center justify-center">
                <CheckCircle className="mr-2" /> Wallet Payment
              </button>
            </div>
          </CardContent>
        </Card>

        
      </div>

      {/* New Wallet Balance Toggle Section */}
      <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
          <button 
            onClick={() => setShowBalance(!showBalance)}
            className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 transition-colors"
          >
            <div className="flex items-center">
              <Wallet className="text-blue-600 mr-2" size={20} />
              <span className="font-medium text-gray-800">Available Balance</span>
            </div>
            {showBalance ? 
              <ChevronUp className="text-blue-600" size={20} /> : 
              <ChevronDown className="text-blue-600" size={20} />
            }
          </button>
          
          
        </div>

      {showBalance && (
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Current Balance:</span>
                <span className="text-3xl font-bold text-green-600">₹{ users?.wallet?.balance}</span>
              </div>
              <div className="mt-3 text-xs text-gray-500 flex justify-end">
              
                <div>
                  Last updated: {format(new Date(users?.wallet.transactions.at(-1)?.date ?? new Date(0)), 'PPpp')}
                </div>
             
            </div>
            </div>
          )}

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
