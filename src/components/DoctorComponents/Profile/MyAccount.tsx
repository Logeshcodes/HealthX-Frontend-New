import { useEffect, useState } from 'react';
import { User, Phone, Mail, Briefcase, GraduationCap, Clock, BadgeIndianRupeeIcon, Calendar , BadgeCheck , Store} from 'lucide-react';
import { getDoctorData } from '../../../api/action/DoctorActionApi';

interface UserData {
  name: string;
  email: string;
  Mobile: string;
  department: string;
  education: string;
  experience: string;
  description: string;
  address: string;
  city: string;
  state: string;
  consultationType: string;
  consultationFee: string;
  isVerified: string;
  createdAt: string;
  profilePicture: string
}

const MyAccount = () => {
  const [doctors, setDoctors] = useState<UserData>({
    name: '',
    email: '',
    Mobile: '',
    department: '',
    education: '',
    experience: '',
    description: '',
    address: '',
    city: '',
    state: '',
    consultationType: '',
    consultationFee: '',
    isVerified: '',
    createdAt: '',
    profilePicture :""
  });
  const [loading, setLoading] = useState<boolean>(true);


  const [imgSrc, setImgSrc] = useState(
    doctors.profilePicture || "../../../profile.jpg"
  );

  useEffect(() => {
    if (doctors?.profilePicture) {
      setImgSrc(doctors.profilePicture);
      console.log(doctors.profilePicture , "pic")
    }
  }, [doctors.profilePicture]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const doctorDataString = localStorage.getItem('doctor');
        if (doctorDataString) {
          const doctor = JSON.parse(doctorDataString);
          const email = doctor?.email;
          console.log('Doctor Email:', email);

          if (email) {
            const data = await getDoctorData(email);
            console.log('Doctors list:', data);
            setDoctors(data);
          }
        } else {
          console.log('No doctor data found in localStorage');
        }
      } catch (error) {
        console.log('Error fetching doctors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Section */}
          <div className="lg:w-2/3 space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-gray-600">Full Name</label>
                <div className="flex items-center space-x-3 p-3 bg-gray-200 rounded-lg">
                  <User size={20} className="text-blue-500" />
                  <span>{doctors.name}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-600">Phone Number</label>
                <div className="flex items-center space-x-3 p-3 bg-gray-200 rounded-lg">
                  <Phone size={20} className="text-blue-500" />
                  <span>{doctors.Mobile}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-600">Email Address</label>
                <div className="flex items-center space-x-3 p-3 bg-gray-200 rounded-lg">
                  <Mail size={20} className="text-blue-500" />
                  <span>{doctors.email}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-600">Department</label>
                <div className="flex items-center space-x-3 p-3 bg-gray-200 rounded-lg">
                  <Briefcase size={20} className="text-blue-500" />
                  <span>{doctors.department}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-600">Education</label>
                <div className="flex items-center space-x-3 p-3 bg-gray-200 rounded-lg">
                  <GraduationCap size={20} className="text-blue-500" />
                  <span>{doctors.education}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-600">Experience</label>
                <div className="flex items-center space-x-3 p-3 bg-gray-200 rounded-lg">
                <BadgeCheck size={20} className="text-blue-500" />
                  <span>{doctors.experience} years</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-600">Consultation Type</label>
                <div className="flex items-center space-x-3 p-3 bg-gray-200 rounded-lg">
                  <Clock size={20} className="text-blue-500" />
                  <span>{doctors.consultationType}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-600">Consultation Fee</label>
                <div className="flex items-center space-x-3 p-3 bg-gray-200 rounded-lg">
                  <BadgeIndianRupeeIcon size={20} className="text-blue-500" />
                  <span>{doctors.consultationFee}</span>
                </div>
              </div>
            </div>

            
          </div>

          {/* Right Section */}
          <div className="lg:w-1/3 bg-gray-50 rounded-lg p-6">
            <div className="flex flex-col items-center">
            <img
              src={imgSrc}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-blue-100"
              onError={(e) => (e.currentTarget.src = "../../../profile.jpg")}
            />
              <h3 className="font-medium text-gray-800">{doctors.name}</h3>
              <p className="text-gray-500">{doctors.department}</p>

              <div className="w-full mt-6 space-y-4">

              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Store size={20} className="text-blue-500" />
                    <span className="text-sm">Bio</span>
                  </div>
                  <span className="text-sm text-gray-600">{doctors.description}</span>
                </div>


                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Calendar size={20} className="text-blue-500" />
                    <span className="text-sm">Joined</span>
                  </div>
                  <span className="text-sm text-gray-600">{new Date(doctors.createdAt).toLocaleDateString('en-GB')}</span>
                </div>
               


              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAccount;
