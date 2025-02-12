import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const isAdminAuthenticated = Boolean(localStorage.getItem("doctor"));
  
  return isAdminAuthenticated ? <Outlet /> : <Navigate to="/doctor/login" />;
};

export default PrivateRoute;