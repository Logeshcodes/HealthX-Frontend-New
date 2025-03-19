import { CheckCircle, Clock , UserPlus , AlertCircle , XCircle, Star } from 'lucide-react';
import { getDoctorData, GetDoctorReviews } from '../../../api/action/DoctorActionApi';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface UserData {
  _id : string ;
  name: string;
  department: string;
  isVerified: string;
  createdAt: string;
  status : string ;
  profilePicture : string
}



const AccountStatus = () => {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState<UserData>({
    _id : "",
    name: "",
    department: "",
    isVerified: "",
    createdAt: "",
    status : "",
    profilePicture: ""
  });

  const [averageRating, setAverageRating] = useState(0);
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
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Account Status</h2>
          <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg">
          <img
              src={imgSrc}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-blue-100"
              onError={(e) => (e.currentTarget.src = "../../../profile.jpg")}
            />
            <h3 className="text-xl font-medium text-gray-800 mb-2">{doctors.name}</h3>
            <p className="text-gray-500 mb-6">{doctors.department}</p>

            
              {renderStars(averageRating)}
          

            <div className="flex items-center space-x-2">
                {(() => {
                  switch (doctors.status) {
                    case 'registered':
                      return (
                        <div className="flex items-center text-blue-500">
                          <UserPlus size={24} />
                          <span className="font-medium p-3">Registered, Waiting for Submission</span>
                        </div>
                      );
                    case 'pending':
                      return (
                        <div className="flex items-center text-yellow-500">
                          <Clock size={24} />
                          <span className="font-medium p-3">Pending Verification</span>
                        </div>
                      );
                    case 'approved':
                      return (
                        <div className="flex items-center text-green-500">
                          <CheckCircle size={24} />
                          <span className="font-medium p-3">Verified Account</span>
                        </div>
                      );
                    case 'rejected':
                      return (
                        <div className="flex items-center text-red-500">
                          <XCircle size={24} />
                          <span className="font-medium p-3">Verification Rejected</span>
                        </div>
                      );
                    default:
                      return (
                        <div className="flex items-center text-gray-500">
                          <AlertCircle size={24} />
                          <span className="px-2 font-medium">Not yet verified</span>
                        </div>
                      );
                  }
                })()}
              </div>


            <div className="mt-6">
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">Joined</span>
                <span className="text-sm text-gray-600">{new Date(doctors.createdAt).toLocaleDateString('en-GB')}</span>
              </div>
            </div>
          </div>
          <p className="text-center">
            Please Upload Your Verification Certificates{' '}
            <button
              onClick={() => navigate('/doctor/profile/verify-profile')}
              className="text-blue-600 underline"
            >
              click here
            </button>
          </p>
        </div>
      )}
    </div>
  );
};

export default AccountStatus;
