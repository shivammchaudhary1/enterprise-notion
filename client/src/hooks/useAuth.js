import { useAuthStore } from "../stores";

/**
 * Custom hook for authentication
 * Provides a convenient interface to the auth store
 */
export const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    validationErrors,
    message,
    setCredentials,
    logout,
    clearError,
    clearMessage,
    registerUser,
    loginUser,
    getCurrentUser,
    forgotPassword,
    resetPassword,
  } = useAuthStore();

  return {
    // State
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    validationErrors,
    message,

    // Actions
    setCredentials,
    logout,
    clearError,
    clearMessage,

    // Async actions
    register: registerUser,
    login: loginUser,
    getCurrentUser,
    forgotPassword,
    resetPassword,
  };
};

export default useAuth;
