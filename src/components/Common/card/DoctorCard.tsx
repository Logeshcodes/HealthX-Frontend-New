import { CheckCircle, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GetDoctorReviews } from '../../../api/action/DoctorActionApi';



const DoctorCard = ({ doctor }: { doctor: any }) => {

  const [averageRating, setAverageRating] = useState(0);
  
  const navigate = useNavigate()


  useEffect(() => {

    const fetchAverageRating = async () => {
      try {
        const updatedReviews = await GetDoctorReviews(doctor._id);
        setAverageRating(updatedReviews.data.averageRating);
      } catch (error) {
        console.log("Error fetching average rating:", error);
      }
    }

    fetchAverageRating();
  }, [doctor]);


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
    <div className="p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="relative flex-shrink-0">
          <div onClick={()=> {navigate(`/user/doctor_details/${doctor.email}`)}} className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-400 flex items-center justify-center">
          
            <img
              src={doctor.profilePicture || '/api/placeholder/96/96'}
              alt="Doctor"
              className="w-20 h-20 rounded-full object-cover"
            />
        
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center text-white border-2 border-white">
            <CheckCircle className="w-4 h-4" />
          </div>
        </div>

        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
            <a href={`/user/doctor_details/${doctor.email}`}>
              <h3 className="text-xl font-semibold text-blue-500 mb-1">{doctor.name}</h3>
            </a>
            
              <div className="flex">
              {renderStars(averageRating)}
            </div>
        
              <p className="text-gray-600 mb-1">{doctor.department}</p>
              <p className="text-gray-600 mb-1">{doctor.education}</p>
              <p className="text-gray-500 text-sm mb-2">{doctor.experience} years experience overall</p>
              {/* <p className="font-medium mb-1">{doctor.city}, {doctor.state}</p> */}
              <p className="text-gray-600 text-sm">{doctor.hospital}</p>
              <p className="text-gray-500 text-sm mt-2">{doctor.description}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-green-500 text-sm font-medium">FREE</span>
                <span className="text-gray-500 text-sm">{doctor.consultationFee} Consultation fee at clinic</span>
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end gap-2">
              <span className="text-green-500 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Available Today
              </span>
              <p className="text-gray-500 text-sm">{doctor.consultationType} Consultation</p>
              <button onClick={()=> {navigate(`/user/doctor_details/${doctor.email}`)}} className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Consult Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
