import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const location = useLocation();
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  if (!isLoggedIn) {
    return <Navigate replace state={{ from: location.pathname }} to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
