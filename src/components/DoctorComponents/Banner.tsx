import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DoctorBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const banners = [
    {
      id: 1,
      title: "Quality Healthcare Services",
      description: "Get the best medical care from our expert doctors",
      image: "/api/placeholder/1200/600"  // Increased image height
    },
    {
      id: 2,
      title: "Book Appointments Online",
      description: "Easy and convenient appointment booking system",
      image: "/api/placeholder/1200/600"  // Increased image height
    },
    {
      id: 3,
      title: "24/7 Emergency Services",
      description: "Round the clock medical support when you need it most",
      image: "/api/placeholder/1200/600"  // Increased image height
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white ">
        <div className="container mx-auto flex justify-between items-center">

         
        </div>
      </nav>

      {/* Banner Carousel - Increased height */}
      <div className="relative w-full h-[800px] overflow-hidden">
        {/* Banner Images */}
        <div 
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {banners.map((banner) => (
            <div key={banner.id} className="w-full flex-shrink-0 relative">
              <img 
                src={banner.image} 
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <div className="text-center text-white">
                  <h2 className="text-5xl font-bold mb-6">{banner.title}</h2>
                  <p className="text-2xl">{banner.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows - Made slightly bigger */}
        <button 
          onClick={prevSlide}
          className="absolute left-6 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100"
        >
          <ChevronLeft className="w-8 h-8 text-gray-800" />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100"
        >
          <ChevronRight className="w-8 h-8 text-gray-800" />
        </button>

        {/* Dot Indicators - Made slightly bigger */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-4 h-4 rounded-full ${
                currentSlide === index ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorBanner;