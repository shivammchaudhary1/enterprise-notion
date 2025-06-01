// Success response helper
export const successMessage = (message, data = null, meta = null) => {
  const response = {
    success: true,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  if (meta !== null) {
    response.meta = meta;
  }

  return response;
};

// Error response helper
export const errorMessage = (message, errors = null, statusCode = null) => {
  const response = {
    success: false,
    message,
  };

  if (errors !== null) {
    response.errors = errors;
  }

  if (statusCode !== null) {
    response.statusCode = statusCode;
  }

  return response;
};

// Validation error response helper
export const validationErrorMessage = (errors) => {
  return {
    success: false,
    message: "Validation failed",
    errors,
  };
};
