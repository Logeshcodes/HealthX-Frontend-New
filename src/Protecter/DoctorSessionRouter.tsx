import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: JSX.Element;
}

const DoctorSessionRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('doctor') || 'null');

  if (user) {
    return <Navigate to="/doctor" replace />;
  }

  return children;
};

export default DoctorSessionRoute;
