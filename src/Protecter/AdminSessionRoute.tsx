import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: JSX.Element;
}

const AdminSessionRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('admin') || 'null');

  if (user) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

export default AdminSessionRoute;
