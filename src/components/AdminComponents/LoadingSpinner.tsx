
const LoadingSpinner= () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-800">
      <div className="flex items-center justify-center space-x-2">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-opacity-75"></div>
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-purple-500 border-opacity-75"></div>
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-teal-500 border-opacity-75"></div>
      </div>
      <p className="mt-6 text-lg font-semibold text-gray-600">Loading...</p>
    </div>
  );
};

export default LoadingSpinner;