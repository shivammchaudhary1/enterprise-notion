import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "../../redux/slices/authSlice";
import { getToken, setToken } from "../../redux/api/authAPI";

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { token, isAuthenticated, user } = useSelector((state) => state.auth);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      if (token && !isAuthenticated && !user) {
        // We have a token but no user data, likely from persistence
        // Sync the token to authAPI and validate it
        setToken(token);
        try {
          await dispatch(getCurrentUser()).unwrap();
        } catch (error) {
          console.error("Failed to restore authentication:", error);
        }
      }
      setIsInitialized(true);
    };

    initializeAuth();
  }, [dispatch, token, isAuthenticated, user]);

  // Don't render children until auth is initialized
  if (!isInitialized) {
    return null;
  }

  return <>{children}</>;
};

export default AuthProvider;
