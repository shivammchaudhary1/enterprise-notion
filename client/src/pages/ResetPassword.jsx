import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { resetPassword } from "../redux/slices/authSlice";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Alert } from "../components/ui/Alert";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, validationErrors, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  // Redirect if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    // Client-side validation
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters long");
      return;
    }

    const result = await dispatch(resetPassword({ token, password }));

    if (resetPassword.fulfilled.match(result)) {
      // Redirect will happen automatically due to authentication state change
    }
  };

  const getFieldError = (fieldName) => {
    return validationErrors?.[fieldName]?.[0] || "";
  };

  const passwordStrength = (password) => {
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const length = password.length >= 8;

    const score = [hasLower, hasUpper, hasNumber, hasSpecial, length].filter(
      Boolean
    ).length;

    if (score < 2)
      return { label: "Weak", color: "text-red-500", width: "20%" };
    if (score < 4)
      return { label: "Fair", color: "text-yellow-500", width: "60%" };
    return { label: "Strong", color: "text-green-500", width: "100%" };
  };

  const strength = passwordStrength(password);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                <svg
                  className="h-8 w-8 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Invalid Reset Link
              </h2>

              <p className="text-gray-600 mb-6">
                This password reset link is invalid or has expired.
              </p>

              <div className="space-y-4">
                <Link to="/forgot-password">
                  <Button className="w-full">Request New Reset Link</Button>
                </Link>

                <Link
                  to="/login"
                  className="block text-center text-sm text-indigo-600 hover:text-indigo-500 transition-colors"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <div className="text-center mb-8">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
            </div>

            <h2 className="text-3xl font-bold text-gray-900">
              Reset Your Password
            </h2>

            <p className="mt-3 text-gray-600">
              Enter your new password below. Make sure it's strong and secure.
            </p>
          </div>

          {(error || localError) && (
            <div className="mb-6">
              <Alert variant="error" message={error || localError} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                label="New Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your new password"
                error={getFieldError("password")}
                required
                className="w-full"
              />

              {password && (
                <div className="mt-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Password strength:</span>
                    <span className={`font-medium ${strength.color}`}>
                      {strength.label}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        strength.label === "Weak"
                          ? "bg-red-500"
                          : strength.label === "Fair"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                      style={{ width: strength.width }}
                    ></div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500 space-y-1">
                    <div className="grid grid-cols-2 gap-2">
                      <span
                        className={
                          password.length >= 8
                            ? "text-green-600"
                            : "text-gray-400"
                        }
                      >
                        ✓ 8+ characters
                      </span>
                      <span
                        className={
                          /[A-Z]/.test(password)
                            ? "text-green-600"
                            : "text-gray-400"
                        }
                      >
                        ✓ Uppercase letter
                      </span>
                      <span
                        className={
                          /[a-z]/.test(password)
                            ? "text-green-600"
                            : "text-gray-400"
                        }
                      >
                        ✓ Lowercase letter
                      </span>
                      <span
                        className={
                          /\d/.test(password)
                            ? "text-green-600"
                            : "text-gray-400"
                        }
                      >
                        ✓ Number
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <Input
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                required
                className="w-full"
              />

              {confirmPassword && password !== confirmPassword && (
                <p className="mt-2 text-sm text-red-600">
                  Passwords do not match
                </p>
              )}

              {confirmPassword &&
                password === confirmPassword &&
                confirmPassword.length > 0 && (
                  <p className="mt-2 text-sm text-green-600">
                    ✓ Passwords match
                  </p>
                )}
            </div>

            <div>
              <Button
                type="submit"
                isLoading={isLoading}
                disabled={
                  !password.trim() ||
                  !confirmPassword.trim() ||
                  password !== confirmPassword ||
                  password.length < 6 ||
                  isLoading
                }
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-medium"
              >
                {isLoading ? "Resetting Password..." : "Reset Password"}
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <Link
              to="/login"
              className="text-sm text-indigo-600 hover:text-indigo-500 transition-colors font-medium"
            >
              ← Back to Login
            </Link>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>
            Having trouble? Contact our{" "}
            <a
              href="mailto:support@enterprisenotion.com"
              className="text-indigo-600 hover:text-indigo-500 transition-colors"
            >
              support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
