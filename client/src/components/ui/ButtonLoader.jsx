import React from "react";
import LoadingSpinner from "./LoadingSpinner";

const ButtonLoader = ({
  size = "default",
  color = "white",
  className = "",
  text = "",
}) => {
  const spinnerSizes = {
    small: "small",
    default: "small",
    large: "default",
  };

  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      <LoadingSpinner size={spinnerSizes[size]} color={color} />
      {text && <span>{text}</span>}
    </div>
  );
};

export default ButtonLoader;
