import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import DoctorCard from './DoctorCard';
import PaginationDots from '../Common/Home/PaginationDots';
import { getDoctorHomeData } from '../../api/action/UserActionApi';

interface Doctor{
  name : string ,
  department : string ,
  profilePicture : string ,
}

const DoctorCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(2);

  const [doctors , setDoctors] = useState<Doctor[]>([])


  useEffect(()=>{

    const fetchDoctors = async ()=>{
      const response = await getDoctorHomeData();
      setDoctors(response.users)

    }

    fetchDoctors()

  } , [])


  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? doctors.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === doctors.length - 1 ? 0 : prev + 1));
  };

  const getVisibleDoctors = () => {
    const visibleDoctors = [];
    for (let i = -2; i <= 2; i++) {
      let index = currentIndex + i;
      if (index < 0) index = doctors.length + index;
      if (index >= doctors.length) index = index - doctors.length;
      visibleDoctors.push({ ...doctors[index], position: i });
    }
    return visibleDoctors;
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Medical Specialists</h2>
          <p className="text-lg text-gray-600">Expert healthcare professionals at your service</p>
        </div>
      <div className="relative">
        {/* Navigation Buttons */}
        <button
          onClick={handlePrevious}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
        >
          <ChevronRight size={24} />
        </button>

        {/* Doctors Carousel */}
        <div className="flex justify-center items-center gap-4 overflow-hidden">
          {getVisibleDoctors().map((doctor, idx) => (
            
            <DoctorCard key={idx} doctor={doctor} position={doctor.position} />
          ))}
        </div>

        {/* Pagination Dots */}
        <PaginationDots
          doctors={doctors}
          currentIndex={currentIndex}
          onDotClick={setCurrentIndex}
        />
      </div>
    </div>
  );
};

export default DoctorCarousel;
