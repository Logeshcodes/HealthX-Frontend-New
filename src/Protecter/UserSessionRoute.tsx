import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: JSX.Element;
}

const UserSessionRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default UserSessionRoute;
