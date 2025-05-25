import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const AuthGuard = () => {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state?.auth?.user?.token);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (!user || !isAuthenticated || !token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default AuthGuard;
