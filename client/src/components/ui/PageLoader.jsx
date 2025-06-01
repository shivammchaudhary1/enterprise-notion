import React from "react";
import LoadingSpinner from "./LoadingSpinner";

const PageLoader = ({ message = "Loading...", overlay = true }) => {
  const overlayClasses = overlay
    ? "fixed inset-0 bg-white bg-opacity-90 z-50"
    : "w-full";

  return (
    <div className={`${overlayClasses} flex items-center justify-center`}>
      <div className="flex flex-col items-center space-y-4">
        <LoadingSpinner size="xl" color="blue" />
        <div className="text-center">
          <p className="text-lg font-medium text-gray-900">{message}</p>
          <p className="text-sm text-gray-500 mt-1">Please wait a moment...</p>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
