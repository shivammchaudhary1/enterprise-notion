import toast from "react-hot-toast";

// Custom toast styles
const toastStyles = {
  duration: 4000,
  style: {
    borderRadius: "8px",
    background: "#333",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "500",
    padding: "12px 16px",
    maxWidth: "500px",
  },
};

// Success toast
export const showSuccessToast = (message) => {
  return toast.success(message, {
    ...toastStyles,
    style: {
      ...toastStyles.style,
      background: "#10B981",
      color: "#fff",
    },
    iconTheme: {
      primary: "#fff",
      secondary: "#10B981",
    },
  });
};

// Error toast
export const showErrorToast = (message) => {
  return toast.error(message, {
    ...toastStyles,
    style: {
      ...toastStyles.style,
      background: "#EF4444",
      color: "#fff",
    },
    iconTheme: {
      primary: "#fff",
      secondary: "#EF4444",
    },
  });
};

// Warning toast
export const showWarningToast = (message) => {
  return toast(message, {
    ...toastStyles,
    icon: "⚠️",
    style: {
      ...toastStyles.style,
      background: "#F59E0B",
      color: "#fff",
    },
  });
};

// Info toast
export const showInfoToast = (message) => {
  return toast(message, {
    ...toastStyles,
    icon: "ℹ️",
    style: {
      ...toastStyles.style,
      background: "#3B82F6",
      color: "#fff",
    },
  });
};

// Loading toast
export const showLoadingToast = (message) => {
  return toast.loading(message, {
    ...toastStyles,
    style: {
      ...toastStyles.style,
      background: "#6B7280",
      color: "#fff",
    },
  });
};

// Dismiss specific toast
export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};

// Dismiss all toasts
export const dismissAllToasts = () => {
  toast.dismiss();
};

// Promise toast (for async operations)
export const showPromiseToast = (promise, messages) => {
  return toast.promise(
    promise,
    {
      loading: messages.loading || "Loading...",
      success: messages.success || "Success!",
      error: messages.error || "Something went wrong!",
    },
    {
      ...toastStyles,
      success: {
        ...toastStyles,
        style: {
          ...toastStyles.style,
          background: "#10B981",
        },
      },
      error: {
        ...toastStyles,
        style: {
          ...toastStyles.style,
          background: "#EF4444",
        },
      },
    }
  );
};

// Custom toast with custom styling
export const showCustomToast = (message, options = {}) => {
  return toast(message, {
    ...toastStyles,
    ...options,
    style: {
      ...toastStyles.style,
      ...options.style,
    },
  });
};
