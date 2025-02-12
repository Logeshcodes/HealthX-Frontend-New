const PaginationDots = ({ doctors, currentIndex, onDotClick } : any) => {
    return (
      <div className="flex justify-center gap-2 mt-8">
        {doctors.map((_ : any, idx : any) => (
          <button
            key={idx}
            onClick={() => onDotClick(idx)}
            className={`w-3 h-3 rounded-full transition-all ${
              idx === currentIndex ? 'bg-blue-600 w-6' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };
  
  export default PaginationDots;
  