import React from "react";

const LoadingSpinner = ({
  size = "default",
  className = "",
  color = "blue",
  thickness = "default",
}) => {
  const sizes = {
    small: "h-4 w-4",
    default: "h-6 w-6",
    large: "h-8 w-8",
    xl: "h-12 w-12",
  };

  const colors = {
    blue: "border-blue-600",
    green: "border-green-600",
    red: "border-red-600",
    gray: "border-gray-600",
    white: "border-white",
  };

  const thicknesses = {
    thin: "border-2",
    default: "border-2",
    thick: "border-4",
  };

  return (
    <div
      className={`
        animate-spin rounded-full border-gray-300 border-t-transparent
        ${sizes[size]} 
        ${colors[color]} 
        ${thicknesses[thickness]}
        ${className}
      `}
      style={{
        borderTopColor: "transparent",
      }}
    ></div>
  );
};

export default LoadingSpinner;
