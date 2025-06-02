import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../stores";
import { setToken } from "../../redux/api/authAPI";

const AuthProvider = ({ children }) => {
  const { token, isAuthenticated, user, getCurrentUser } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      if (token && !isAuthenticated && !user) {
        // We have a token but no user data, likely from persistence
        // Sync the token to authAPI and validate it
        setToken(token);
        try {
          await getCurrentUser();
        } catch (error) {
          console.error("Failed to restore authentication:", error);
        }
      }
      setIsInitialized(true);
    };

    initializeAuth();
  }, [token, isAuthenticated, user, getCurrentUser]);

  // Don't render children until auth is initialized
  if (!isInitialized) {
    return null;
  }

  return <>{children}</>;
};

export default AuthProvider;
