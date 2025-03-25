
const DoctorCard = ({ doctor, position }: any) => {

  if (!doctor) return null;

  return (
    <div
      className={`transform transition-all duration-500 ease-in-out ${
        position === 0
          ? 'scale-100 opacity-100 z-10'
          : Math.abs(position) === 1
          ? 'scale-[0.85] opacity-75'
          : 'scale-[0.7] opacity-50'
      }`}
    >
      <div 
        className="bg-white rounded-2xl shadow-lg hover:shadow-2xl p-6 w-72 md:w-80 cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:bg-blue-50/50"
      >
        <div className="flex justify-center mb-6">
          {doctor.profilePicture ? (
            <img
              src={doctor.profilePicture}
              alt={doctor.name || 'Doctor Image'}
              className="w-36 h-36 object-cover rounded-full border-4 border-blue-100 hover:border-blue-300 transition-colors shadow-md"
            />
          ) : (
            <div className="w-36 h-36 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-inner">
              <span className="text-gray-400 text-lg font-medium">No Image</span>
            </div>
          )}
        </div>
        <div className="text-center space-y-3">
          <h3 className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
            {doctor.name || 'Unknown Name'}
          </h3>
          <p className="text-blue-600 font-medium inline-block px-4 py-1 bg-blue-50 rounded-full">
            {doctor.department || 'Specialty Not Provided'}
          </p>
          {doctor.experience && (
            <p className="text-gray-600 text-sm font-medium">
              {doctor.experience} Years Experience
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
