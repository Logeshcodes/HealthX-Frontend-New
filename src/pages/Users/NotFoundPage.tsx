import {  useNavigate } from "react-router-dom";

const NotFoundPage = () => {


  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold text-red-500">404 - Page Not Found</h1>
      <p className="mt-2 text-gray-600">Sorry, the page you're looking for doesn't exist.</p>
      <button onClick={()=> navigate(-1)} className="mt-4 text-blue-500 hover:underline">
        Go Back
      </button>
    </div>
  );
};

export default NotFoundPage;
