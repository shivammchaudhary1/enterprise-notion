import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser, setCredentials } from "../../redux/slices/authSlice";

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    // Try to restore authentication state on app load
    // In a production app, you might want to store a refresh token in httpOnly cookies
    // and use it to get a new access token here

    // For now, we'll just check if we have a token and validate it
    if (token) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, token]);

  return <>{children}</>;
};

export default AuthProvider;
