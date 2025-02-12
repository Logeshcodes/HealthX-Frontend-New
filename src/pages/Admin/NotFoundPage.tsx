import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold text-red-500">404 - Page Not Found</h1>
      <p className="mt-2 text-gray-600">Sorry, the page you're looking for doesn't exist.</p>
      <Link to="/admin/dashboard" className="mt-4 text-blue-500 hover:underline">
        Go Back to Dashboard
      </Link>
    </div>
  );
};

export default NotFoundPage;
