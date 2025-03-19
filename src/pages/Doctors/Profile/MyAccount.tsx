import { useEffect, useState } from 'react';
import { User, Phone, Mail, Briefcase, GraduationCap, Clock, BadgeIndianRupeeIcon, Calendar , BadgeCheck , Store, Star} from 'lucide-react';
import { getDoctorData, GetDoctorReviews } from '../../../api/action/DoctorActionApi';

interface UserData {
  _id : string ;
  name: string;
  email: string;
  Mobile: string;
  department: string;
  education: string;
  experience: string;
  description: string;
  gender: string;
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
    _id : "",
    name: '',
    email: '',
    Mobile: '',
    department: '',
    education: '',
    experience: '',
    description: '',
    gender: '',
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
  const [averageRating, setAverageRating] = useState(0);

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


  useEffect(() => {
  
    const fetchAverageRating = async () => {
      try {
        const updatedReviews = await GetDoctorReviews(doctors._id);
        setAverageRating(updatedReviews.data.averageRating);
      } catch (error) {
        console.log("Error fetching average rating:", error);
      }
    }

    fetchAverageRating();
  }, [doctors]);


  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((index) => {
          const difference = rating - index + 1;
          return (
            <div key={index} className="relative">
              {difference >= 1 ? (
                // Full star
                <Star className="h-5 w-5 text-yellow-500" fill="#FFD700" />
              ) : difference > 0 ? (
                // Partial star
                <div className="relative">
                  <Star className="h-5 w-5 text-gray-300" />
                  <div className="absolute top-0 overflow-hidden" style={{ width: `${difference * 100}%` }}>
                    <Star className="h-5 w-5 text-yellow-500" fill="#FFD700" />
                  </div>
                </div>
              ) : (
                // Empty star
                <Star className="h-5 w-5 text-gray-300" />
              )}
            </div>
          );
        })}
        <span className="ml-2 text-sm text-gray-600">
          {averageRating > 0 ? averageRating.toFixed(1) : 'No ratings'}
        </span>
      </div>
    );
  };


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
          <div className="lg:w-1/3 bg-white shadow-lg rounded-2xl p-6">
  <div className="flex flex-col items-center">
    <img
      src={imgSrc}
      alt="Profile"
      className="w-28 h-28 rounded-full object-cover border-4 border-blue-200 shadow-md"
      onError={(e) => (e.currentTarget.src = "../../../profile.jpg")}
    />
    <h3 className="mt-4 text-lg font-semibold text-gray-900">{doctors.name}</h3>
    <p className="text-sm text-blue-600">{doctors.department}</p>
    {renderStars(averageRating)}

    <div className="w-full mt-6 space-y-4">
      <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow">
        <div className="flex items-center space-x-3">
          <Store size={20} className="text-blue-500" />
          <span className="text-sm font-medium">Bio</span>
        </div>
        <span className="text-sm text-gray-700">{doctors.description}</span>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow">
        <div className="flex items-center space-x-3">
          <Calendar size={20} className="text-blue-500" />
          <span className="text-sm font-medium">Joined</span>
        </div>
        <span className="text-sm text-gray-700">
          {new Date(doctors.createdAt).toLocaleDateString("en-GB")}
        </span>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow">
        <div className="flex items-center space-x-3">
          <Calendar size={20} className="text-blue-500" />
          <span className="text-sm font-medium">Gender</span>
        </div>
        <span className="text-sm text-gray-700">{doctors.gender}</span>
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
