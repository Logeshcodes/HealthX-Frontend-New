const PaginationDots = ({ doctors, currentIndex, onDotClick } : any) => {
  return (
    <div className="flex justify-center gap-3 mt-10">
      {doctors.map((_ : any, idx : any) => (
        <button
          key={idx}
          onClick={() => onDotClick(idx)}
          className={`w-3 h-3 rounded-full transition-all duration-300 ${
            idx === currentIndex 
              ? 'bg-blue-600 w-8 transform scale-110' 
              : 'bg-gray-300 hover:bg-gray-400'
          }`}
          aria-label={`Go to slide ${idx + 1}`}
        />
      ))}
    </div>
  );
};

export default PaginationDots;
