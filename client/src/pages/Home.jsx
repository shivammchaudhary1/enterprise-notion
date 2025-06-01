import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Alert, AlertDescription } from "../components/ui/Alert";
import { clearMessage } from "../redux/slices/authSlice";
import { useAuthLogout } from "../hooks/useAuthLogout";

const Home = () => {
  const dispatch = useDispatch();
  const handleLogout = useAuthLogout();
  const { user, isAuthenticated, message } = useSelector((state) => state.auth);

  useEffect(() => {
    // Clear welcome message after 5 seconds
    if (message) {
      const timer = setTimeout(() => {
        dispatch(clearMessage());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, dispatch]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full text-center space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to Enterprise Notion
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Please sign in to access your workspace
            </p>
          </div>
          <div className="space-y-4">
            <Link to="/login">
              <Button className="w-full">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" className="w-full">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Enterprise Notion
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.name}!</span>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Message */}
          {message && (
            <div className="mb-6">
              <Alert variant="success">
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            </div>
          )}

          {/* Dashboard Content */}
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Your Workspace
              </h2>
              <p className="text-gray-600 mb-6">
                Welcome to your secure workspace. Your authentication system is
                working perfectly!
              </p>

              {/* User Info Card */}
              <div className="bg-white rounded-lg shadow p-6 max-w-md mx-auto">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Account Information
                </h3>
                <div className="space-y-2 text-left">
                  <div>
                    <span className="font-medium text-gray-700">Name:</span>
                    <span className="ml-2 text-gray-900">{user?.name}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Email:</span>
                    <span className="ml-2 text-gray-900">{user?.email}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">User ID:</span>
                    <span className="ml-2 text-gray-900 font-mono text-sm">
                      {user?.id}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
