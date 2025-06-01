import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/slices/authSlice";
import { persistor } from "../redux/store";

export const useAuthLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    // Clear authentication state
    dispatch(logout());

    // Clear persisted state
    await persistor.purge();

    // Navigate to login
    navigate("/login", { replace: true });
  };

  return handleLogout;
};
