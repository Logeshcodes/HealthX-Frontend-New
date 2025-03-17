import { useNavigate } from "react-router-dom";

const DoctorCard = ({ doctor, position }: any) => {

  const navigate = useNavigate()
  if (!doctor) return <div>No doctor information available</div>;

  return (
    <div
      className={`transform transition-all duration-300 ${
        position === 0
          ? 'scale-100 opacity-100 z-10'
          : Math.abs(position) === 1
          ? 'scale-75 opacity-70'
          : 'scale-50 opacity-40'
      }`}
    >
     
      <div onClick={()=>navigate(`/user/doctor_details/${doctor.email}`)} className="bg-white rounded-lg shadow-lg p-4 w-64">
        {doctor.profilePicture ? (
          <img
            src={doctor.profilePicture}
            alt={doctor.name || 'Doctor Image'}
            className="w-full object-cover  rounded-full mb-4"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
            No Image Available
          </div>
        )}
        <h3 className="text-xl font-semibold text-center mb-2">
          {doctor.name || 'Unknown Name'}
        </h3>
        <p className="text-gray-600 text-center">
          {doctor.department || 'Specialty Not Provided'}
        </p>
      </div>
     
    </div>
  );
};

export default DoctorCard;
