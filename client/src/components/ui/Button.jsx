import React from "react";
import { cn } from "../../lib/utils";
import ButtonLoader from "./ButtonLoader";

const Button = React.forwardRef(
  (
    {
      className,
      variant = "default",
      size = "default",
      loading = false,
      loadingText = "",
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const variants = {
      default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
      outline:
        "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500",
      ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
      destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    };

    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 px-3",
      lg: "h-11 px-8",
    };

    const isDisabled = disabled || loading;

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className
        )}
        disabled={isDisabled}
        ref={ref}
        {...props}
      >
        {loading ? (
          <ButtonLoader
            size={size}
            color={variant === "outline" ? "gray" : "white"}
            text={loadingText}
          />
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
