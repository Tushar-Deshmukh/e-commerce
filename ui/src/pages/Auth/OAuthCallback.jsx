import { useEffect,useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSignIn } from "../../store/slices/authSlice";
import { toast } from "react-hot-toast";

const OAuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const hasHandled = useRef(false);

  useEffect(() => {
    if (hasHandled.current) return;
    hasHandled.current = true;

    const query = new URLSearchParams(location.search);
    const token = query.get("token");
    const email = query.get("email");
    const first_name = query.get("first_name");
    const last_name = query.get("last_name");
    const role = query.get("role");

    if (token && email) {
      const user = { token, email, first_name, last_name, role };
      dispatch(setSignIn(user));
      toast.success("Logged in with Google!");
      navigate("/dashboard");
    } else {
      toast.error("OAuth login failed");
      navigate("/login");
    }
  }, [location, dispatch, navigate]);

  return <div className="text-center mt-10 text-lg">Logging you in...</div>;
};

export default OAuthCallback;
