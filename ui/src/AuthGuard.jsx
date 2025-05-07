import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const AuthGuard = () => {
  const user = useSelector((state) => state.auth.user);

  if (!user || !user.token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default AuthGuard;
