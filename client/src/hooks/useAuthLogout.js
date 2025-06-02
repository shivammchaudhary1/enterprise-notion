import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores";

export const useAuthLogout = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    // Clear authentication state
    await logout();

    // Navigate to login
    navigate("/login", { replace: true });
  };

  return handleLogout;
};
