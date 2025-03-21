import { useEffect, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Calendar, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

import { getAllBanner } from '../../api/action/UserActionApi';



interface Banner {
  _id: string;
  bannerTitle: string;
  link: string;
  role: string;
  isListed: boolean;
  bannerImage: string;
  startDate: string;
  endDate: string;
  description: string;
}

const BannerComponent = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [autoPlay, setAutoPlay] = useState(true);
  const [loading, setLoading] = useState(true);



useEffect(() => {
  const fetchBanners = async () => {
    const banner = await getAllBanner();
    setBanners(banner.banners);

    console.log("banner", banner);
    setLoading(false);
  };

  fetchBanners();
}, []);

  useEffect(() => {
    if (!autoPlay) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [autoPlay, banners.length]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
    setAutoPlay(false);
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-[300px] sm:min-h-[400px] md:min-h-[600px] lg:min-h-[800px] bg-gray-100">
      <AnimatePresence mode="wait">
        {banners.map((banner, index) => (
          index === currentSlide && (
            <motion.div
              key={banner._id}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.7 }}
              className="absolute inset-0"
            >
              <div className="relative w-full h-full overflow-hidden">
                <img
                  src={banner.bannerImage}
                  alt={banner.bannerTitle}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-3000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 text-white">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="max-w-4xl mx-auto"
                    >
                      <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-2 sm:mb-4">
                        {banner.bannerTitle}
                      </h2>
                      <p className="text-base sm:text-lg md:text-2xl mb-4 sm:mb-6 line-clamp-2 sm:line-clamp-none">
                        {banner.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 sm:gap-4 items-center text-sm sm:text-base opacity-75">
                        <div className="flex items-center bg-black/30 rounded-full px-3 py-1">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>
                            {format(new Date(banner.startDate), 'MMM dd')} - 
                            {format(new Date(banner.endDate), 'MMM dd, yyyy')}
                          </span>
                        </div>
                      </div>

                      <a 
                        href={banner.link}
                        className="inline-flex items-center mt-4 sm:mt-6 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 rounded-full text-white transition-all duration-300 transform hover:scale-105 shadow-lg"
                      >
                        Learn More
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        ))}
      </AnimatePresence>

      {/* Enhanced Navigation Controls */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-2 sm:gap-4 z-10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={prevSlide}
          className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors"
        >
          <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
        </motion.button>

        <div className="flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSlide === index 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={nextSlide}
          className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors"
        >
          <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
        </motion.button>
      </div>

      {/* Enhanced Auto-play Toggle */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        onClick={() => setAutoPlay(!autoPlay)}
        className={`absolute top-4 right-4 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm ${
          autoPlay ? 'bg-white/20' : 'bg-white/10'
        } hover:bg-white/30 backdrop-blur-sm text-white transition-colors`}
      >
        {autoPlay ? 'Pause' : 'Play'} Slideshow
      </motion.button>
    </div>
  );
};

export default BannerComponent;