/**
 * Validation middleware for authentication routes
 */

// Validation rules
const validationRules = {
  register: {
    name: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-Z\s]+$/,
    },
    email: {
      required: true,
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    },
    password: {
      required: true,
      minLength: 6,
      maxLength: 128,
    },
  },
  login: {
    email: {
      required: true,
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    },
    password: {
      required: true,
    },
  },
};

// Validation helper function
const validateField = (value, rules, fieldName) => {
  const errors = [];

  // Required check
  if (
    rules.required &&
    (!value || (typeof value === "string" && !value.trim()))
  ) {
    errors.push(`${fieldName} is required`);
    return errors; // Return early if required field is missing
  }

  // Skip other validations if field is empty and not required
  if (!value) return errors;

  // String validations
  if (typeof value === "string") {
    const trimmedValue = value.trim();

    // Minimum length
    if (rules.minLength && trimmedValue.length < rules.minLength) {
      errors.push(
        `${fieldName} must be at least ${rules.minLength} characters long`
      );
    }

    // Maximum length
    if (rules.maxLength && trimmedValue.length > rules.maxLength) {
      errors.push(
        `${fieldName} must be no more than ${rules.maxLength} characters long`
      );
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(trimmedValue)) {
      if (fieldName.toLowerCase() === "email") {
        errors.push("Please provide a valid email address");
      } else if (fieldName.toLowerCase() === "name") {
        errors.push("Name can only contain letters and spaces");
      } else {
        errors.push(`${fieldName} format is invalid`);
      }
    }
  }

  return errors;
};

// Main validation middleware
export const validateRegistration = (req, res, next) => {
  const { name, email, password } = req.body;
  const rules = validationRules.register;
  const errors = {};

  // Validate each field
  const nameErrors = validateField(name, rules.name, "Name");
  const emailErrors = validateField(email, rules.email, "Email");
  const passwordErrors = validateField(password, rules.password, "Password");

  if (nameErrors.length > 0) errors.name = nameErrors;
  if (emailErrors.length > 0) errors.email = emailErrors;
  if (passwordErrors.length > 0) errors.password = passwordErrors;

  // Additional password strength validation
  if (password && password.length >= 6) {
    const passwordStrengthErrors = [];

    // Check for at least one number
    if (!/\d/.test(password)) {
      passwordStrengthErrors.push(
        "Password should contain at least one number"
      );
    }

    // Check for at least one letter
    if (!/[a-zA-Z]/.test(password)) {
      passwordStrengthErrors.push(
        "Password should contain at least one letter"
      );
    }

    if (passwordStrengthErrors.length > 0) {
      errors.password = [...(errors.password || []), ...passwordStrengthErrors];
    }
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const rules = validationRules.login;
  const errors = {};

  // Validate each field
  const emailErrors = validateField(email, rules.email, "Email");
  const passwordErrors = validateField(password, rules.password, "Password");

  if (emailErrors.length > 0) errors.email = emailErrors;
  if (passwordErrors.length > 0) errors.password = passwordErrors;

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};

export const validateForgotPassword = (req, res, next) => {
  const { email } = req.body;
  const errors = {};

  // Validate email
  const emailErrors = validateField(
    email,
    validationRules.login.email,
    "Email"
  );
  if (emailErrors.length > 0) errors.email = emailErrors;

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};

export const validateResetPassword = (req, res, next) => {
  const { password } = req.body;
  const { token } = req.params;
  const errors = {};

  // Validate token
  if (!token || typeof token !== "string" || token.trim().length === 0) {
    errors.token = ["Reset token is required"];
  }

  // Validate password
  const passwordErrors = validateField(
    password,
    validationRules.register.password,
    "Password"
  );
  if (passwordErrors.length > 0) errors.password = passwordErrors;

  // Additional password strength validation
  if (password && password.length >= 6) {
    const passwordStrengthErrors = [];

    if (!/(?=.*[a-z])/.test(password)) {
      passwordStrengthErrors.push(
        "Password must contain at least one lowercase letter"
      );
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      passwordStrengthErrors.push(
        "Password must contain at least one uppercase letter"
      );
    }
    if (!/(?=.*\d)/.test(password)) {
      passwordStrengthErrors.push("Password must contain at least one number");
    }

    if (passwordStrengthErrors.length > 0) {
      errors.password = [...(errors.password || []), ...passwordStrengthErrors];
    }
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};

// Rate limiting configuration for auth routes
export const authRateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: "Too many authentication attempts, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
};
